(async function() {
    if (document.getElementById('custom-excalidraw-sidebar')) return;

    // --- COOKIES ---
    const setCookie = (n, v) => document.cookie = `${n}=${v}; path=/; max-age=31536000; SameSite=Lax`;
    const getCookie = (n) => {
        const v = `; ${document.cookie}`;
        const p = v.split(`; ${n}=`);
        return p.length === 2 ? p.pop().split(';').shift() : null;
    };

    // --- IDIOMAS ---
    const languages = {
        'pt-BR': 'Português (Brasil)',
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'it': 'Italiano',
        'de': 'Deutsch'
    };

    const translations = {
        'pt-BR': {
            appName: 'Excalidraw Local Addon',
            pinSidebar: 'Fixar menu',
            unpinSidebar: 'Desafixar menu',
            language: 'Idioma',
            selectFolder: '📂 Abrir Projetos',
            changeFolder: '📂 Mudar Pasta',
            reconnectFolder: '🔌 Conectar Pasta',
            newFile: '📄 Novo',
            deleteFile: '🗑️ Excluir',
            noFileOpen: 'Nenhum arquivo aberto',
            open: 'Aberto:',
            autoSaved: '🔄 Auto-Salvo',
            saved: '✅ Salvo',
            errorLoading: 'Erro ao carregar.',
            selectFile: 'Selecione um arquivo na lista.',
            confirmDelete: 'Tem certeza que deseja excluir "{name}"?',
            deleted: 'Excluído',
            saveFileDescription: 'Excalidraw Workspace',
            suggestedFileName: 'Novo_Projeto.exw'
        },
        'en': {
            appName: 'Excalidraw Local Addon',
            pinSidebar: 'Pin menu',
            unpinSidebar: 'Unpin menu',
            language: 'Language',
            selectFolder: '📂 Open Projects',
            changeFolder: '📂 Change Folder',
            reconnectFolder: '🔌 Reconnect Folder',
            newFile: '📄 New',
            deleteFile: '🗑️ Delete',
            noFileOpen: 'No file open',
            open: 'Open:',
            autoSaved: '🔄 Auto-saved',
            saved: '✅ Saved',
            errorLoading: 'Error loading file.',
            selectFile: 'Select a file from the list.',
            confirmDelete: 'Are you sure you want to delete "{name}"?',
            deleted: 'Deleted',
            saveFileDescription: 'Excalidraw Workspace',
            suggestedFileName: 'New_Project.exw'
        },
        'es': {
            appName: 'Excalidraw Local Addon',
            pinSidebar: 'Fijar menú',
            unpinSidebar: 'Desfijar menú',
            language: 'Idioma',
            selectFolder: '📂 Abrir proyectos',
            changeFolder: '📂 Cambiar carpeta',
            reconnectFolder: '🔌 Reconectar carpeta',
            newFile: '📄 Nuevo',
            deleteFile: '🗑️ Eliminar',
            noFileOpen: 'Ningún archivo abierto',
            open: 'Abierto:',
            autoSaved: '🔄 Guardado automático',
            saved: '✅ Guardado',
            errorLoading: 'Error al cargar el archivo.',
            selectFile: 'Selecciona un archivo de la lista.',
            confirmDelete: '¿Seguro que deseas eliminar "{name}"?',
            deleted: 'Eliminado',
            saveFileDescription: 'Espacio de trabajo de Excalidraw',
            suggestedFileName: 'Nuevo_Proyecto.exw'
        },
        'fr': {
            appName: 'Excalidraw Local Addon',
            pinSidebar: 'Épingler le menu',
            unpinSidebar: 'Désépingler le menu',
            language: 'Langue',
            selectFolder: '📂 Ouvrir les projets',
            changeFolder: '📂 Changer de dossier',
            reconnectFolder: '🔌 Reconnecter le dossier',
            newFile: '📄 Nouveau',
            deleteFile: '🗑️ Supprimer',
            noFileOpen: 'Aucun fichier ouvert',
            open: 'Ouvert :',
            autoSaved: '🔄 Enregistré automatiquement',
            saved: '✅ Enregistré',
            errorLoading: 'Erreur lors du chargement du fichier.',
            selectFile: 'Sélectionnez un fichier dans la liste.',
            confirmDelete: 'Voulez-vous vraiment supprimer « {name} » ?',
            deleted: 'Supprimé',
            saveFileDescription: 'Espace de travail Excalidraw',
            suggestedFileName: 'Nouveau_Projet.exw'
        },
        'it': {
            appName: 'Excalidraw Local Addon',
            pinSidebar: 'Fissa menu',
            unpinSidebar: 'Sblocca menu',
            language: 'Lingua',
            selectFolder: '📂 Apri progetti',
            changeFolder: '📂 Cambia cartella',
            reconnectFolder: '🔌 Riconnetti cartella',
            newFile: '📄 Nuovo',
            deleteFile: '🗑️ Elimina',
            noFileOpen: 'Nessun file aperto',
            open: 'Aperto:',
            autoSaved: '🔄 Salvato automaticamente',
            saved: '✅ Salvato',
            errorLoading: 'Errore durante il caricamento del file.',
            selectFile: 'Seleziona un file dall’elenco.',
            confirmDelete: 'Vuoi davvero eliminare "{name}"?',
            deleted: 'Eliminato',
            saveFileDescription: 'Area di lavoro Excalidraw',
            suggestedFileName: 'Nuovo_Progetto.exw'
        },
        'de': {
            appName: 'Excalidraw Local Addon',
            pinSidebar: 'Menü anheften',
            unpinSidebar: 'Menü lösen',
            language: 'Sprache',
            selectFolder: '📂 Projekte öffnen',
            changeFolder: '📂 Ordner ändern',
            reconnectFolder: '🔌 Ordner erneut verbinden',
            newFile: '📄 Neu',
            deleteFile: '🗑️ Löschen',
            noFileOpen: 'Keine Datei geöffnet',
            open: 'Geöffnet:',
            autoSaved: '🔄 Automatisch gespeichert',
            saved: '✅ Gespeichert',
            errorLoading: 'Fehler beim Laden der Datei.',
            selectFile: 'Wählen Sie eine Datei aus der Liste aus.',
            confirmDelete: 'Möchten Sie „{name}“ wirklich löschen?',
            deleted: 'Gelöscht',
            saveFileDescription: 'Excalidraw-Arbeitsbereich',
            suggestedFileName: 'Neues_Projekt.exw'
        }
    };

    // --- PERSISTÊNCIA DE CONFIGURAÇÕES VIA INDEXEDDB (Sem APIs externas) ---
    const saveSetting = (key, value) => {
        return new Promise((resolve) => {
            const req = indexedDB.open("ExcaliLocalDB", 1);
            req.onupgradeneeded = (e) => {
                if (!e.target.result.objectStoreNames.contains('settings')) {
                    e.target.result.createObjectStore('settings');
                }
            };
            req.onsuccess = (e) => {
                const db = e.target.result;
                const tx = db.transaction("settings", "readwrite");
                tx.objectStore("settings").put(value, key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            };
            req.onerror = () => resolve();
        });
    };

    const getSetting = (key) => {
        return new Promise((resolve) => {
            const req = indexedDB.open("ExcaliLocalDB", 1);
            req.onupgradeneeded = (e) => {
                if (!e.target.result.objectStoreNames.contains('settings')) {
                    e.target.result.createObjectStore('settings');
                }
            };
            req.onsuccess = (e) => {
                const db = e.target.result;
                const tx = db.transaction("settings", "readonly");
                const storeReq = tx.objectStore("settings").get(key);
                storeReq.onsuccess = () => resolve(storeReq.result);
                storeReq.onerror = () => resolve(null);
            };
            req.onerror = () => resolve(null);
        });
    };

    const saveFolderHandle = (handle) => saveSetting('folderHandle', handle);
    const getFolderHandle = () => getSetting('folderHandle');
    const saveLanguage = (language) => saveSetting('language', language);
    const getLanguage = () => getSetting('language');

    let currentLanguage = await getLanguage();
    if (!Object.prototype.hasOwnProperty.call(languages, currentLanguage)) {
        currentLanguage = 'pt-BR';
    }

    const translate = (key, values = {}) => {
        let message = (translations[currentLanguage] && translations[currentLanguage][key]) || translations['pt-BR'][key] || key;
        Object.entries(values).forEach(([name, value]) => {
            message = message.replace(`{${name}}`, value);
        });
        return message;
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
                    <span id="sidebar-title"></span>
                    <button id="pin-sidebar" type="button" style="cursor:pointer; font-size: 13px;" aria-label="">📌</button>
                </h3>
                <div class="language-control">
                    <label id="language-label" for="language-select"></label>
                    <select id="language-select">
                        ${Object.entries(languages).map(([code, name]) => `<option value="${code}">${name}</option>`).join('')}
                    </select>
                </div>
                <div class="sidebar-buttons">
                    <button id="btn-select-folder" class="sidebar-btn"></button>
                    <button id="btn-new-file" class="sidebar-btn"></button>
                    <button id="btn-delete-file" class="sidebar-btn"></button>
                </div>
            </div>
            <div id="file-tree"></div>
            <div id="active-file-status"></div>
        </div>
    `;
    document.body.appendChild(sidebar);

    const btnSelect = document.getElementById('btn-select-folder');
    const btnNewFile = document.getElementById('btn-new-file');
    const btnDeleteFile = document.getElementById('btn-delete-file');
    const pinBtn = document.getElementById('pin-sidebar');
    const languageSelect = document.getElementById('language-select');

    const updateFolderButton = () => {
        if (btnSelect.dataset.action === 'reactivate') {
            btnSelect.innerText = translate('reconnectFolder');
        } else if (currentDirHandle) {
            btnSelect.innerText = translate('changeFolder');
        } else {
            btnSelect.innerText = translate('selectFolder');
        }
    };

    const updateFileStatus = (status = 'open', name = '') => {
        const statusDiv = document.getElementById('active-file-status');
        statusDiv.replaceChildren();
        if (status === 'open' && name) {
            const label = document.createElement('b');
            label.innerText = translate('open');
            statusDiv.append(label, document.createTextNode(` ${name}`));
        } else if (status === 'saved' || status === 'autoSaved') {
            const message = status === 'autoSaved' ? translate('autoSaved') : translate('saved');
            const label = document.createElement('span');
            label.style.color = '#4caf50';
            label.innerText = `${message}: ${name}`;
            statusDiv.appendChild(label);
        } else {
            statusDiv.innerText = translate(status);
        }
    };

    const applyLanguage = () => {
        sidebar.lang = currentLanguage;
        document.getElementById('sidebar-title').innerText = translate('appName');
        document.getElementById('language-label').innerText = translate('language');
        btnNewFile.innerText = translate('newFile');
        btnDeleteFile.innerText = translate('deleteFile');
        languageSelect.value = currentLanguage;
        pinBtn.title = sidebar.classList.contains('pinned') ? translate('unpinSidebar') : translate('pinSidebar');
        pinBtn.setAttribute('aria-label', pinBtn.title);
        updateFolderButton();

        if (activeFileHandle) {
            updateFileStatus('open', activeFileHandle.name.replace('.exw', ''));
        } else {
            updateFileStatus('noFileOpen');
        }
    };

    applyLanguage();

    languageSelect.addEventListener('change', async () => {
        if (!Object.prototype.hasOwnProperty.call(languages, languageSelect.value)) return;
        currentLanguage = languageSelect.value;
        await saveLanguage(currentLanguage);
        applyLanguage();
    });

    // --- LÓGICA DE AFASTAR O EXCALIDRAW ---
    sidebar.addEventListener('mouseenter', () => document.body.classList.add('sidebar-active'));
    sidebar.addEventListener('mouseleave', () => {
        if (!sidebar.classList.contains('pinned')) {
            document.body.classList.remove('sidebar-active');
        }
    });

    const isPinned = getCookie('excaliSidebarPinned') === 'true';
    
    if (isPinned) {
        sidebar.classList.add('pinned');
        document.body.classList.add('sidebar-active'); 
        pinBtn.style.opacity = '1';
        pinBtn.title = translate('unpinSidebar');
        pinBtn.setAttribute('aria-label', pinBtn.title);
    } else {
        pinBtn.style.opacity = '0.3';
    }

    pinBtn.addEventListener('click', () => {
        const p = sidebar.classList.toggle('pinned');
        pinBtn.style.opacity = p ? '1' : '0.3';
        pinBtn.title = p ? translate('unpinSidebar') : translate('pinSidebar');
        pinBtn.setAttribute('aria-label', pinBtn.title);
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
                    updateFolderButton();
                    const tempHandle = await ensureTemporaryFileExists(); 
                    if (tempHandle) await openExcalidrawFile(tempHandle, currentDirHandle, null);
                    await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
                } else {
                    btnSelect.dataset.action = "reactivate";
                    updateFolderButton();
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
                        delete btnSelect.dataset.action;
                        updateFolderButton();
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
            delete btnSelect.dataset.action;
            updateFolderButton();
            
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
            updateFileStatus('open', displayName);
            document.querySelectorAll('#file-tree li').forEach(el => el.classList.remove('active-file'));
            if (liElement) liElement.classList.add('active-file');

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const target = document.querySelector('.excalidraw-container') || document.body;
            target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
            
            await ensureTemporaryFileExists();
        } catch (e) { alert(translate('errorLoading')); }
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
            updateFileStatus(isAutoSave ? 'autoSaved' : 'saved', displayName);
            setTimeout(() => { 
                if (activeFileHandle) {
                    const currName = activeFileHandle.name.replace('.exw', '');
                    updateFileStatus('open', currName);
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
    btnNewFile.addEventListener('click', async () => {
        try {
            const h = await window.showSaveFilePicker({
                suggestedName: translate('suggestedFileName'),
                types: [{ description: translate('saveFileDescription'), accept: { 'application/json': ['.exw'] } }]
            });
            const b = JSON.stringify({ type: "excalidraw", version: 2, elements: [], appState: {}, files: {} });
            const w = await h.createWritable(); await w.write(b); await w.close();
            await openExcalidrawFile(h, null, null);
            if (currentDirHandle) await renderTree(currentDirHandle, document.getElementById('file-tree'), "");
        } catch (e) {}
    });

    btnDeleteFile.addEventListener('click', async () => {
        if (!activeFileHandle || !activeParentDirHandle) return alert(translate('selectFile'));
        const cleanName = activeFileHandle.name.replace('.exw', '');
        if (!confirm(translate('confirmDelete', { name: cleanName }))) return;
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
                updateFileStatus('deleted');
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
