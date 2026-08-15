(function() {
    if (document.getElementById('custom-excalidraw-sidebar')) return;

    // --- COOKIES ---
    const setCookie = (n, v) => document.cookie = `${n}=${v}; path=/; max-age=31536000; SameSite=Lax`;
    const getCookie = (n) => {
        const v = `; ${document.cookie}`;
        const p = v.split(`; ${n}=`);
        return p.length === 2 ? p.pop().split(';').shift() : null;
    };

    // --- NOVO: PERSISTÊNCIA DA PASTA VIA INDEXEDDB (Sem APIs externas) ---
    const saveFolderHandle = (handle) => {
        return new Promise((resolve) => {
            const req = indexedDB.open("ExcaliLocalDB", 1);
            req.onupgradeneeded = (e) => e.target.result.createObjectStore("settings");
            req.onsuccess = (e) => {
                const db = e.target.result;
                const tx = db.transaction("settings", "readwrite");
                tx.objectStore("settings").put(handle, "folderHandle");
                tx.oncomplete = () => resolve();
            };
        });
    };

    const getFolderHandle = () => {
        return new Promise((resolve) => {
            const req = indexedDB.open("ExcaliLocalDB", 1);
            req.onupgradeneeded = (e) => e.target.result.createObjectStore("settings");
            req.onsuccess = (e) => {
                const db = e.target.result;
                const tx = db.transaction("settings", "readonly");
                const storeReq = tx.objectStore("settings").get("folderHandle");
                storeReq.onsuccess = () => resolve(storeReq.result);
                storeReq.onerror = () => resolve(null);
            };
            req.onerror = () => resolve(null);
        });
    };

    // --- ESCUDO LOCAL ---
    if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
    window.WebSocket = function() { return { send: () => {}, close: () => {}, addEventListener: () => {}, readyState: 0 }; };

    // --- ESTADO GLOBAL ---
    let currentDirHandle = null;
    let activeFileHandle = null;
    let activeParentDirHandle = null;
    let saveTimeout = null;
    let expandedFolders = new Set(); 

    // 1. Interface
    const sidebar = document.createElement('div');
    sidebar.id = 'custom-excalidraw-sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-content">
            <div style="flex-shrink: 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 15px; display: flex; justify-content: space-between; align-items: center;">
                    Excalidraw Local
                    <span id="pin-sidebar" style="cursor:pointer; font-size: 13px;" title="Fixar menu">📌</span>
                </h3>
                <div class="sidebar-buttons">
                    <button id="btn-select-folder" class="sidebar-btn">📂 Abrir Projetos</button>
                    <button id="btn-new-file" class="sidebar-btn">📄 Novo</button>
                    <button id="btn-delete-file" class="sidebar-btn">🗑️ Excluir</button>
                </div>
            </div>
            <div id="file-tree"></div>
            <div id="active-file-status">Nenhum arquivo aberto</div>
        </div>
    `;
    document.body.appendChild(sidebar);

    const btnSelect = document.getElementById('btn-select-folder');

    // --- LÓGICA DE AFASTAR O EXCALIDRAW ---
    sidebar.addEventListener('mouseenter', () => document.body.classList.add('sidebar-active'));
    sidebar.addEventListener('mouseleave', () => {
        if (!sidebar.classList.contains('pinned')) {
            document.body.classList.remove('sidebar-active');
        }
    });

    const pinBtn = document.getElementById('pin-sidebar');
    const isPinned = getCookie('excaliSidebarPinned') === 'true';
    
    if (isPinned) {
        sidebar.classList.add('pinned');
        document.body.classList.add('sidebar-active'); 
        pinBtn.style.opacity = '1';
    } else {
        pinBtn.style.opacity = '0.3';
    }

    pinBtn.addEventListener('click', () => {
        const p = sidebar.classList.toggle('pinned');
        pinBtn.style.opacity = p ? '1' : '0.3';
        setCookie('excaliSidebarPinned', p);
        if (p) {
            document.body.classList.add('sidebar-active');
        }
    });

    // 2. Refresh Automático Assíncrono (5 segundos)
    setInterval(async () => {
        if (currentDirHandle) {
            await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
        }
    }, 5000);

    // --- GARANTE ARQUIVO TEMPORÁRIO NA RAIZ ---
    async function ensureTemporaryFileExists() {
        if (!currentDirHandle) return null;
        try {
            return await currentDirHandle.getFileHandle('Temporario.exw', { create: false });
        } catch (e) {
            try {
                const tempHandle = await currentDirHandle.getFileHandle('Temporario.exw', { create: true });
                const blank = JSON.stringify({ type: "excalidraw", version: 2, elements: [], appState: {}, files: {} });
                const w = await tempHandle.createWritable();
                await w.write(blank);
                await w.close();
                return tempHandle;
            } catch (createErr) {
                console.error("Erro ao criar o arquivo Temporario automático:", createErr);
                return null;
            }
        }
    }

    // --- ROTINA ASSÍNCRONA DE AUTO-LOAD AO RECARREGAR PÁGINA (F5) ---
    async function checkSavedFolderOnLoad() {
        try {
            const savedHandle = await getFolderHandle();
            if (savedHandle) {
                const perm = await savedHandle.queryPermission({ mode: 'readwrite' });
                if (perm === 'granted') {
                    currentDirHandle = savedHandle;
                    btnSelect.innerText = "📂 Mudar Pasta";
                    const tempHandle = await ensureTemporaryFileExists(); 
                    if (tempHandle) await openExcalidrawFile(tempHandle, currentDirHandle, null);
                    await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
                } else {
                    btnSelect.innerText = "🔌 Conectar Pasta";
                    btnSelect.dataset.action = "reactivate";
                }
            }
        } catch (e) { console.error(e); }
    }
    checkSavedFolderOnLoad();

    // 3. Funções de Arquivo
    btnSelect.addEventListener('click', async () => {
        try {
            if (btnSelect.dataset.action === "reactivate") {
                const savedHandle = await getFolderHandle();
                if (savedHandle) {
                    const reqPerm = await savedHandle.requestPermission({ mode: 'readwrite' });
                    if (reqPerm === 'granted') {
                        currentDirHandle = savedHandle;
                        btnSelect.innerText = "📂 Mudar Pasta";
                        delete btnSelect.dataset.action;
                        const tempHandle = await ensureTemporaryFileExists(); 
                        if (tempHandle) await openExcalidrawFile(tempHandle, currentDirHandle, null);
                        await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
                    }
                }
                return;
            }

            currentDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
            await saveFolderHandle(currentDirHandle); 
            expandedFolders.clear(); 
            btnSelect.innerText = "📂 Mudar Pasta";
            
            const tempHandle = await ensureTemporaryFileExists(); 
            if (tempHandle) {
                await openExcalidrawFile(tempHandle, currentDirHandle, null);
            }
            await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
        } catch (e) {}
    });

    async function openExcalidrawFile(fileHandle, parentDirHandle, liElement) {
        if (activeFileHandle) await saveCurrentFile(false); // SafeSwitch

        try {
            const file = await fileHandle.getFile();
            activeFileHandle = fileHandle;
            activeParentDirHandle = parentDirHandle;

            const displayName = file.name.replace('.exw', '');
            document.getElementById('active-file-status').innerHTML = `<b>Aberto:</b> ${displayName}`;
            document.querySelectorAll('#file-tree li').forEach(el => el.classList.remove('active-file'));
            if (liElement) liElement.classList.add('active-file');

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const target = document.querySelector('.excalidraw-container') || document.body;
            target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
            
            await ensureTemporaryFileExists();
        } catch (e) { alert("Erro ao carregar."); }
    }

    async function saveCurrentFile(isAutoSave = false) {
        if (!activeFileHandle) return;
        try {
            const el = localStorage.getItem('excalidraw');
            const st = localStorage.getItem('excalidraw-state');
            if (!el) return;

            const data = JSON.stringify({
                type: "excalidraw", version: 2, source: window.location.href,
                elements: JSON.parse(el), appState: JSON.parse(st || "{}"), files: {}
            }, null, 2);

            const w = await activeFileHandle.createWritable();
            await w.write(data); await w.close();

            const displayName = activeFileHandle.name.replace('.exw', '');
            const statusDiv = document.getElementById('active-file-status');
            const msg = isAutoSave ? '🔄 Auto-Salvo' : '✅ Salvo';
            statusDiv.innerHTML = `<span style="color: #4caf50;">${msg}: ${displayName}</span>`;
            setTimeout(() => { 
                if (activeFileHandle) {
                    const currName = activeFileHandle.name.replace('.exw', '');
                    statusDiv.innerHTML = `<b>Aberto:</b> ${currName}`; 
                }
            }, 1500);
        } catch (e) {}
    }

    // 4. Renderizador de Árvore Inteligente
    async function renderTree(dirHandle, container, path) {
        const ul = document.createElement('ul');
        let entries = [];
        try {
            for await (const entry of dirHandle.values()) entries.push(entry);
        } catch(e) { return; } 

        entries.sort((a, b) => a.kind === b.kind ? a.name.localeCompare(b.name) : (a.kind === 'directory' ? -1 : 1));

        for (const entry of entries) {
            if (entry.kind !== 'directory' && !entry.name.endsWith('.exw')) {
                continue;
            }

            const li = document.createElement('li');
            const currentPath = path + "/" + entry.name;

            if (entry.kind === 'directory') {
                const isExpanded = expandedFolders.has(currentPath);
                li.innerHTML = `<span class="folder-icon">${isExpanded ? '📂' : '📁'}</span> ${entry.name}`;
                
                const childUl = document.createElement('ul');
                childUl.style.display = isExpanded ? 'block' : 'none';
                
                if (isExpanded) {
                    await renderTree(entry, childUl, currentPath);
                }

                li.onclick = async (e) => {
                    e.stopPropagation();
                    if (childUl.style.display === 'none') {
                        expandedFolders.add(currentPath);
                        await renderTree(entry, childUl, currentPath);
                        childUl.style.display = 'block';
                        li.querySelector('.folder-icon').innerText = '📂';
                    } else {
                        expandedFolders.delete(currentPath);
                        childUl.style.display = 'none';
                        li.querySelector('.folder-icon').innerText = '📁';
                    }
                };
                li.appendChild(childUl);
            } else if (entry.name.endsWith('.exw')) {
                const displayName = entry.name.replace('.exw', '');
                li.innerHTML = `<span class="file-icon">📄</span> ${displayName}`;
                
                if (activeFileHandle && entry.name === activeFileHandle.name) {
                    try {
                       if (await entry.isSameEntry(activeFileHandle)) {
                           li.classList.add('active-file');
                           activeParentDirHandle = dirHandle;
                       }
                    } catch(e){}
                }

                li.onclick = (e) => { e.stopPropagation(); openExcalidrawFile(entry, dirHandle, li); };
            }
            ul.appendChild(li);
        }
        
        container.innerHTML = '';
        container.appendChild(ul);
    }

    // 5. Botões Novo e Excluir
    document.getElementById('btn-new-file').addEventListener('click', async () => {
        try {
            const h = await window.showSaveFilePicker({
                suggestedName: 'Novo_Projeto.exw',
                types: [{ description: 'Excalidraw Workspace', accept: { 'application/json': ['.exw'] } }]
            });
            const b = JSON.stringify({ type: "excalidraw", version: 2, elements: [], appState: {}, files: {} });
            const w = await h.createWritable(); await w.write(b); await w.close();
            await openExcalidrawFile(h, null, null);
            if (currentDirHandle) await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
        } catch (e) {}
    });

    document.getElementById('btn-delete-file').addEventListener('click', async () => {
        if (!activeFileHandle || !activeParentDirHandle) return alert("Selecione um arquivo na lista.");
        const cleanName = activeFileHandle.name.replace('.exw', '');
        if (!confirm(`Tem certeza que deseja excluir "${cleanName}"?`)) return;
        try {
            const f = await activeFileHandle.getFile();
            const c = await f.text();
            
            // Adiciona .deleted na extensão mantendo o padrão .exw.deleted
            const d = await activeParentDirHandle.getFileHandle(activeFileHandle.name + '.deleted', { create: true });
            const w = await d.createWritable(); await w.write(c); await w.close();
            
            await activeParentDirHandle.removeEntry(activeFileHandle.name);
            
            activeFileHandle = null;
            activeParentDirHandle = null;
            localStorage.removeItem('excalidraw');

            const tempHandle = await ensureTemporaryFileExists();

            if (currentDirHandle) {
                await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
            }

            if (tempHandle) {
                await openExcalidrawFile(tempHandle, currentDirHandle, null);
            } else {
                document.getElementById('active-file-status').innerText = "Excluído";
            }

        } catch (e) {
            console.error(e);
        }
    });

    // 6. Eventos de Teclado e LocalStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(k, v) {
        originalSetItem.apply(this, arguments);
        if (k === 'excalidraw' && activeFileHandle) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => saveCurrentFile(true), 1500);
        }
    };

    window.addEventListener('keydown', async (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            if (!activeFileHandle) return;
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            clearTimeout(saveTimeout);
            await saveCurrentFile(false);
        }
    }, { capture: true });

})();