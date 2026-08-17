# Excalidraw Local Addon

> Uma barra lateral local para organizar, abrir e salvar projetos do [Excalidraw](https://excalidraw.com/) em pastas do computador.

Este projeto é um complemento de navegador no formato de código de usuário (*user script* + CSS). Ele não é uma extensão Chrome empacotada: para utilizá-lo, o código de [`JS.js`](./JS.js) e [`CSS.css`](./CSS.css) deve ser instalado em uma extensão capaz de injetar JavaScript e CSS nas páginas, como [User JavaScript and CSS v3.1.2](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb).

---

## Português (Brasil)

### O que é

O Excalidraw é uma ferramenta de desenho e quadro branco digital acessível pelo navegador. Por padrão, seus arquivos podem ser abertos e salvos por meio dos recursos da própria aplicação. Este complemento acrescenta uma experiência semelhante a um gerenciador de projetos:

- cria uma barra lateral recolhida na borda esquerda da tela;
- permite escolher entre português (Brasil), inglês, espanhol, francês, italiano e alemão;
- permite escolher uma pasta local como pasta de projetos;
- reproduz a hierarquia de subpastas;
- lista arquivos com extensão `.exw`;
- abre um desenho diretamente no Excalidraw;
- cria novos arquivos;
- salva alterações automaticamente;
- oferece salvamento manual com `Ctrl+S` ou `Cmd+S`;
- permite excluir o arquivo ativo mantendo uma cópia `.exw.deleted`.

O objetivo é manter os desenhos organizados no disco, sem um servidor ou banco de dados próprio do projeto.

Este é um **Chrome sidebar para arquivos locais do Excalidraw**, com **árvore de pastas** para abrir e salvar desenhos em um fluxo de trabalho **local-first** para um quadro branco baseado no navegador.

### Quick Start

1. Instale a extensão [User JavaScript and CSS v3.1.2](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb).
2. Crie uma regra para `https://excalidraw.com/*`.
3. Cole [`JS.js`](./JS.js) no campo JavaScript e [`CSS.css`](./CSS.css) no campo CSS.
4. Salve a regra e recarregue o Excalidraw.
5. Selecione uma pasta local para começar a organizar seus projetos.

### Como funciona em alto nível

O `JS.js` é executado dentro da página do Excalidraw e cria a interface da barra lateral. O `CSS.css` define a aparência, a animação e o deslocamento da área do Excalidraw quando a barra é aberta.

O acesso aos arquivos é feito pela [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API), que exige uma ação explícita do usuário para selecionar a pasta. O navegador entrega ao script um identificador (*handle*) da pasta; o script pode então listar, criar, ler, alterar e remover arquivos somente dentro do acesso concedido.

### Requisitos

- Google Chrome ou outro navegador baseado em Chromium com suporte à File System Access API;
- acesso ao endereço `https://excalidraw.com/`;
- a extensão [User JavaScript and CSS v3.1.2](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb), ou outra extensão equivalente que injete CSS e JavaScript;
- permissão de leitura e escrita na pasta de projetos escolhida;
- arquivos de desenho no formato JSON do Excalidraw, armazenados com a extensão `.exw`.

O projeto depende de APIs modernas do navegador, principalmente `showDirectoryPicker()`, `showSaveFilePicker()`, `FileSystemHandle` e IndexedDB. Portanto, o comportamento pode variar em navegadores que não implementem essas APIs.

### Instalação

#### 1. Baixe ou clone este repositório

```bash
git clone https://github.com/SEU-USUARIO/Excalidraw_local_addon.git
```

Também é possível baixar o repositório como ZIP. Os arquivos necessários são:

- `JS.js`: lógica da barra lateral e integração com arquivos locais;
- `CSS.css`: estilos visuais e ajustes de layout.

#### 2. Instale a extensão de injeção

Instale a extensão [User JavaScript and CSS v3.1.2 na Chrome Web Store](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb).

O nome e os menus da extensão podem mudar em versões futuras. Use a função que permita criar uma regra para um site e inserir JavaScript e CSS personalizados.

#### 3. Crie uma regra somente para o Excalidraw

Configure a regra para aplicar o código ao endereço do Excalidraw, preferencialmente:

```text
https://excalidraw.com/*
```

Não aplique este JavaScript globalmente em todos os sites. O script altera objetos e comportamentos da página, incluindo `WebSocket` e Service Workers, e foi escrito para o DOM e o armazenamento local do Excalidraw.

#### 4. Cole os códigos

No campo de JavaScript da extensão, cole o conteúdo completo de [`JS.js`](./JS.js). No campo de CSS, cole o conteúdo completo de [`CSS.css`](./CSS.css).

Salve ou ative a regra e recarregue `https://excalidraw.com/`. Se a extensão oferecer a opção de habilitar a execução em modo anônimo, isso é opcional e não é necessário para o uso normal.

### Primeiro uso

1. Abra ou recarregue o Excalidraw.
2. Mova o mouse até a faixa estreita na borda esquerda. A barra lateral se expandirá.
3. Clique em **Abrir Projetos**.
4. Escolha uma pasta no seletor nativo do sistema.
5. Autorize o acesso de leitura e escrita quando o Chrome solicitar.
6. A árvore de arquivos será preenchida com as subpastas e os arquivos `.exw` encontrados.

Depois da primeira autorização, o script guarda o identificador da pasta em IndexedDB para tentar reconectar automaticamente após um recarregamento. O navegador pode exigir uma nova ação do usuário em algum momento; nesse caso, o botão mudará para **Conectar Pasta**.

### Alterar o idioma

Clique no ícone de globo no rodapé da barra lateral para abrir o seletor **Idioma** e escolher uma das seis opções disponíveis:

- Português (Brasil);
- English;
- Español;
- Français;
- Italiano;
- Deutsch.

A escolha é salva em IndexedDB no mesmo banco `ExcaliLocalDB` e no mesmo object store `settings` usados para persistir a pasta. A pasta continua armazenada na chave `folderHandle`, enquanto o idioma fica armazenado na chave `language`. Assim, o idioma escolhido é restaurado quando a página é recarregada. O padrão inicial é português (Brasil) quando nenhuma escolha anterior é encontrada.

A tradução é aplicada ao nome discreto da aplicação no rodapé, tooltips dos ícones, seletor, dica de fixação, estados do arquivo, mensagens de erro, confirmação de exclusão e descrição do arquivo criado pelo seletor nativo.

### Tema visual

A barra lateral acompanha o tema encontrado no carregamento da página do Excalidraw. O script verifica o tema salvo no estado do aplicativo, as classes e atributos de tema da página e, como fallback, a preferência de tema do sistema. A interface usa ícones SVG monocromáticos e ajusta fundo, texto, bordas, hover, seleção, controles e tooltips para o modo claro ou escuro. Para aplicar uma mudança de tema feita depois do carregamento, recarregue a página.

### Uso da barra lateral

#### Ações e abrir uma pasta

Na parte superior, os três ícones monocromáticos à esquerda representam **Novo**, **Excluir** e **Abrir Projetos**. Depois que uma pasta é conectada, o terceiro ícone passa a representar **Mudar Pasta**. Passe o mouse sobre um ícone para ver sua tooltip. O pin fica alinhado à direita e fixa ou libera a barra lateral.

O ícone de pasta abre o seletor de diretórios. Na primeira utilização ele escolhe a pasta; nas utilizações seguintes, permite trocar a pasta selecionada.

O painel é atualizado automaticamente a cada cinco segundos enquanto uma pasta estiver conectada. A árvore ordena diretórios antes de arquivos e ordena cada grupo alfabeticamente.

#### Navegar pela hierarquia

Clique em uma pasta para expandi-la ou recolhê-la. Somente diretórios e arquivos que terminam exatamente em `.exw` são exibidos. A árvore ignora outros formatos, incluindo `.excalidraw`, a menos que o arquivo seja renomeado para `.exw` e contenha um JSON compatível.

#### Abrir um arquivo

Clique em um arquivo `.exw`. O script lê o conteúdo local e simula um evento de arrastar e soltar na área do Excalidraw, usando o mesmo mecanismo pelo qual a aplicação normalmente recebe um arquivo.

O arquivo ativo recebe uma marca visual e aparece no rodapé da barra lateral. Antes de trocar de arquivo, o script tenta salvar o arquivo que estava aberto.

#### Criar um arquivo

Clique em **Novo**. O navegador exibirá o seletor nativo para salvar um arquivo, com `Novo_Projeto.exw` como nome sugerido.

Para que o novo projeto apareça na árvore, salve-o dentro da pasta de projetos selecionada ou em uma de suas subpastas. O arquivo é criado como um JSON vazio compatível com a versão 2 do formato do Excalidraw e é aberto imediatamente.

#### Salvar

Há duas formas de salvar:

- **Automático:** quando o Excalidraw atualiza a chave `localStorage` chamada `excalidraw`, o script aguarda 1,5 segundo e grava o estado no arquivo ativo. Esse atraso reduz a quantidade de escritas durante uma sequência de alterações.
- **Manual:** pressione `Ctrl+S` no Windows/Linux ou `Cmd+S` no macOS. O script intercepta o atalho e grava imediatamente.

O rodapé mostra mensagens como `Auto-Salvo` e `Salvo` por alguns instantes. O arquivo salvo contém `elements`, `appState`, `type`, `version` e `source`.

#### Excluir um arquivo

Selecione um arquivo, clique em **Excluir** e confirme. Antes de remover o arquivo original, o script cria uma cópia com o sufixo:

```text
meu-projeto.exw.deleted
```

Essa cópia é uma medida de recuperação manual: não existe uma função de restauração na interface. Para tentar recuperar o arquivo, copie ou renomeie a versão `.exw.deleted` para `.exw` e verifique o conteúdo antes de abrir. Ao excluir novamente um arquivo com o mesmo nome, a cópia `.deleted` pode ser sobrescrita.

#### Fixar a barra lateral

Clique no ícone de alfinete. Sem estar fixada, a barra fica recolhida em uma faixa de 15 px e se expande ao receber o mouse. Quando fixada, permanece com 300 px de largura. A escolha é guardada em um cookie chamado `excaliSidebarPinned` por até um ano.

Quando a barra está ativa, o script adiciona a classe `sidebar-active` ao `body` e desloca o elemento `.excalidraw-container` para evitar que a barra cubra o aplicativo.

### Arquivos e formato

O projeto usa a extensão `.exw` como convenção para “Excalidraw Workspace”. O conteúdo continua sendo JSON. Um arquivo vazio criado pelo script tem esta estrutura inicial:

```json
{
  "type": "excalidraw",
  "version": 2,
  "elements": [],
  "appState": {},
  "files": {}
}
```

No salvamento, o script lê:

- `localStorage["excalidraw"]` para os elementos do desenho;
- `localStorage["excalidraw-state"]` para o estado da aplicação.

Em seguida, escreve um novo JSON no arquivo local. O código atual grava `files: {}`; por isso, imagens incorporadas, arquivos anexados e outros recursos binários podem não ser preservados pelo salvamento automático/manual. Para desenhos que usam esses recursos, faça cópias de segurança e valide o arquivo resultante antes de depender dele como única cópia.

### Arquivo temporário automático

Ao conectar uma pasta, o script garante que exista um arquivo chamado `Temporario.exw` na raiz da pasta escolhida. Quando a página é carregada ou a pasta é reconectada, esse arquivo é aberto como área de trabalho inicial.

Esse arquivo é intencionalmente visível no diretório. Se for excluído pela interface, o script poderá recriá-lo para manter uma área de trabalho disponível.

### Privacidade e segurança

O complemento não possui backend próprio, API externa ou serviço de sincronização. A leitura e a escrita dos arquivos são feitas pelo navegador, depois que o usuário concede acesso à pasta. A permissão é vinculada ao site/origem e pode ser revogada nas configurações do Chrome.

Ainda assim, conceder permissão de leitura e escrita a uma pasta é uma decisão importante. Escolha uma pasta específica para os projetos, mantenha cópias de segurança e instale o script somente a partir de uma fonte em que você confie.

O código também contém um bloco chamado `ESCUDO LOCAL` que:

1. tenta cancelar os Service Workers registrados para a origem atual;
2. substitui `window.WebSocket` por uma implementação vazia.

Essas alterações parecem ter sido incluídas para impedir recursos de rede e evitar interferências com a operação local. Elas são amplas e podem afetar recursos do próprio Excalidraw, como colaboração em tempo real, cache/offline e outras funcionalidades que dependam de WebSocket ou Service Worker. Se esse comportamento não for desejado, revise ou remova esse bloco antes de usar o código em produção.

### Limitações conhecidas

- O projeto depende de seletores internos do Excalidraw, especialmente `.excalidraw-container`, `localStorage["excalidraw"]` e `localStorage["excalidraw-state"]`. Uma mudança no Excalidraw pode exigir atualização do script.
- O filtro da árvore exibe somente arquivos `.exw`.
- O salvamento substitui `files` por um objeto vazio; recursos anexados podem ser perdidos.
- O arquivo criado pelo botão **Novo** pode ser salvo fora da pasta conectada. Nesse caso, ele abre normalmente, mas pode não aparecer na árvore e a exclusão pela interface pode não estar disponível até que o script consiga associá-lo a um diretório.
- Não há controle de conflitos entre duas abas, duas janelas ou outro programa editando o mesmo arquivo.
- O refresh de cinco segundos não é um monitor de alterações nativo do sistema de arquivos; ele apenas relê a listagem da pasta.
- Não há lixeira, histórico de versões ou restauração automática. A proteção `.exw.deleted` é uma cópia simples e pode ser sobrescrita.
- A classe CSS `.excalidraw-container` pode não existir em versões futuras ou em outras páginas do Excalidraw.
- O script captura o atalho de salvamento e substitui comportamentos globais da página. Use a regra somente no domínio pretendido.

### Solução de problemas

#### A barra não aparece

- confirme que a regra da extensão está ativa;
- confirme que JavaScript e CSS foram colados nos campos corretos;
- confirme que a regra inclui `https://excalidraw.com/*`;
- recarregue a página depois de salvar a regra;
- abra o console do Chrome (`F12` → **Console**) e procure erros relacionados ao script.

#### O seletor de pasta não abre

O seletor deve ser chamado a partir de um clique do usuário. Clique diretamente em **Abrir Projetos** ou **Conectar Pasta**. Verifique também se o navegador implementa `showDirectoryPicker()`.

#### A pasta aparece como desconectada

O navegador pode ter revogado ou suspendido a permissão. Clique em **Conectar Pasta** e autorize novamente. Se necessário, limpe os dados do site do Excalidraw e selecione a pasta de novo.

#### O arquivo não aparece

Verifique se:

- ele está dentro da pasta selecionada ou de uma subpasta;
- seu nome termina exatamente em `.exw`;
- o painel já passou pelo próximo ciclo de atualização de cinco segundos;
- a extensão do arquivo não é, por exemplo, `.exw.json` por causa das configurações do sistema.

#### O desenho abriu, mas não foi salvo

Verifique se há um arquivo ativo e se o navegador ainda tem permissão de escrita. Tente `Ctrl+S`/`Cmd+S` e observe o rodapé. Lembre-se de que o código depende das chaves de `localStorage` utilizadas pela versão atual do Excalidraw.

#### A colaboração ou o modo offline deixou de funcionar

Revise o bloco `ESCUDO LOCAL` descrito na seção de privacidade. O cancelamento de Service Workers e a substituição de `WebSocket` podem ser incompatíveis com esses recursos.

### Estrutura do repositório

```text
Excalidraw_local_addon/
├── CSS.css    # Estilos da barra lateral e deslocamento do Excalidraw
├── JS.js      # Interface, acesso a arquivos, abertura e salvamento
└── README.md  # Esta documentação
```

### Desenvolvimento e manutenção

Este é um projeto de injeção direta e não possui etapa de compilação ou dependências npm. Para alterar o complemento:

1. edite `JS.js` ou `CSS.css`;
2. copie novamente o conteúdo para a regra da extensão;
3. recarregue o Excalidraw;
4. teste abertura, criação, salvamento, exclusão, reconexão e atualização da árvore.

Ao publicar alterações, descreva no histórico qualquer mudança que afete permissões de arquivos, o formato `.exw`, o salvamento automático, WebSocket ou Service Workers.

### Roadmap

- [x] Navegação por pastas locais
- [x] Salvamento automático
- [x] Interface multilíngue
- [x] Tema claro e escuro
- [ ] Preservar imagens e recursos incorporados
- [ ] Restaurar arquivos excluídos
- [ ] Pesquisar projetos
- [ ] Publicar uma extensão Chrome empacotada
- [ ] Renomear arquivos pela barra lateral

### Apoie o projeto (Support the project)

Se este complemento ajudar você a organizar seus projetos do Excalidraw, considere dar uma ⭐ **Star** ao repositório.

Use **Watch** para acompanhar novas versões, abra uma [Issue](../../issues) para relatar problemas ou sugerir melhorias e envie um [Pull Request](../../pulls) com suas contribuições.

### Licença

Nenhuma licença foi definida neste repositório até o momento. Antes de publicar uma versão pública, escolha e adicione um arquivo `LICENSE` compatível com a forma como você deseja que outras pessoas usem, modifiquem e redistribuam o código.

---

## English

### What it is

Excalidraw is a browser-based drawing and whiteboard application. This project adds a local project browser to it through injected JavaScript and CSS. It is not a packaged Chrome extension: the contents of [`JS.js`](./JS.js) and [`CSS.css`](./CSS.css) must be installed in a browser extension that can inject custom JavaScript and CSS, such as [User JavaScript and CSS v3.1.2](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb).

The add-on provides:

- a collapsible sidebar on the left side of Excalidraw;
- a language selector for Brazilian Portuguese, English, Spanish, French, Italian and German;
- a local project-folder picker;
- nested folder navigation;
- `.exw` file listing;
- direct opening of drawings in Excalidraw;
- new-file creation;
- debounced automatic saving;
- manual saving with `Ctrl+S` or `Cmd+S`;
- deletion with a `.exw.deleted` copy created first.

The goal is to keep Excalidraw drawings organized on the local disk without adding a project-specific server or database.

This is a **Chrome sidebar for local Excalidraw files**, with a **folder tree** to open and save Excalidraw files in a **local-first drawing workflow** for a **browser-based whiteboard**.

### Quick Start

1. Install [User JavaScript and CSS v3.1.2](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb).
2. Create a rule for `https://excalidraw.com/*`.
3. Paste [`JS.js`](./JS.js) into the JavaScript field and [`CSS.css`](./CSS.css) into the CSS field.
4. Save the rule and reload Excalidraw.
5. Select a local folder to start organizing your projects.

### How it works

`JS.js` runs inside the Excalidraw page and creates the sidebar UI. `CSS.css` provides the visual styling, transitions, tree layout and the rules that move the Excalidraw container when the sidebar is active.

Local file access uses the browser's [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API). The user explicitly chooses a directory, and the browser returns a directory handle. The script then uses that handle to list, create, read, write and remove entries within the granted directory.

The selected directory handle is stored in IndexedDB under the database `ExcaliLocalDB`, in the `settings` object store and under the key `folderHandle`. A browser permission check is performed again after a reload.

### Requirements

- Google Chrome or another Chromium-based browser with File System Access API support;
- access to `https://excalidraw.com/`;
- [User JavaScript and CSS v3.1.2](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb), or an equivalent injection extension;
- read/write permission for the selected project directory;
- Excalidraw JSON drawings saved with the `.exw` extension.

The implementation relies on modern browser APIs such as `showDirectoryPicker()`, `showSaveFilePicker()`, `FileSystemHandle` and IndexedDB. Support and permission behavior may differ in browsers that do not implement these APIs.

### Installation

#### 1. Download or clone the repository

```bash
git clone https://github.com/YOUR-USER/Excalidraw_local_addon.git
```

The required files are:

- `JS.js`: sidebar logic and local-file integration;
- `CSS.css`: visual styles and layout adjustments.

#### 2. Install an injection extension

Install [User JavaScript and CSS v3.1.2 from the Chrome Web Store](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb).

The extension UI may change over time. Use the feature that lets you create a site-specific rule containing custom JavaScript and CSS.

#### 3. Scope the rule to Excalidraw

Use a site pattern such as:

```text
https://excalidraw.com/*
```

Do not apply this JavaScript to every website. It changes page-level behavior, including `WebSocket` and Service Workers, and depends on Excalidraw's DOM and local-storage keys.

#### 4. Paste the code

Paste the complete contents of [`JS.js`](./JS.js) into the extension's JavaScript field and the complete contents of [`CSS.css`](./CSS.css) into its CSS field. Save or enable the rule, then reload `https://excalidraw.com/`.

### First use

1. Open or reload Excalidraw.
2. Move the pointer to the narrow strip on the left edge; the sidebar expands.
3. Click **Abrir Projetos** (the current UI label is in Portuguese).
4. Choose a local directory in the native picker.
5. Grant read/write permission when Chrome asks.
6. Browse the folders and `.exw` files shown in the tree.

The handle is persisted in IndexedDB so the script can try to reconnect after a reload. The browser may require a fresh user gesture and permission request later; the button then changes to **Conectar Pasta**.

### Changing the language

Click the globe icon in the sidebar footer to open the **Language** selector and choose one of the six available languages: Portuguese (Brazil), English, Spanish, French, Italian or German. The selection is saved in IndexedDB in the same `ExcaliLocalDB` database and `settings` object store used for the selected directory. The directory remains under the `folderHandle` key, while the language is stored under the `language` key.

The selected language is restored after a page reload. If no previous choice exists, the initial language is Brazilian Portuguese. Translations cover the application name, buttons, pin hint, file statuses, error and delete-confirmation messages, and the native save-picker description and suggested filename.

### Visual theme

The sidebar follows the theme detected when the Excalidraw page loads. The script checks the theme saved in the application's state, page theme classes and attributes, and finally the system color-scheme preference as a fallback. The interface uses monochrome SVG icons and adjusts its background, text, borders, hover states, selection, controls and tooltips for light or dark mode. Reload the page to apply a theme change made after the initial load.

### Using the sidebar

At the top, the three monochrome icons on the left represent **New**, **Delete** and **Open Projects**. After a directory is connected, the third icon represents **Change Folder**. Hover over an icon to see its tooltip. The pin is aligned to the right and keeps the sidebar pinned or released.

Click the folder icon to choose a directory or change the current directory. The tree refreshes every five seconds while a directory is connected. Directories are listed before files, and entries are sorted alphabetically within each group.

Click a folder to expand or collapse it. Only directories and names ending exactly in `.exw` are displayed. Click a file to open it. The script reads the local file and dispatches a synthetic drop event to the Excalidraw container. Before switching files, it attempts to save the current file.

Click **Novo** to open the native save dialog. The suggested name is `Novo_Projeto.exw`. Save it inside the connected project directory if you want it to appear in the tree.

The save behavior is:

- **Automatic:** after Excalidraw writes the `localStorage` key `excalidraw`, the script waits 1.5 seconds and writes the current document to the active file;
- **Manual:** `Ctrl+S` on Windows/Linux or `Cmd+S` on macOS writes the file immediately.

Click **Excluir** to confirm deletion of the active file. The script first writes a copy named `<original>.exw.deleted`, then removes the original. There is no restore button, and a later deletion with the same name can overwrite the `.deleted` copy.

Click the pin icon to keep the sidebar expanded. The pinned state is stored in the `excaliSidebarPinned` cookie for up to one year. When active, the script adds `sidebar-active` to `body` and moves `.excalidraw-container` so the sidebar does not cover the application.

### File format and important limitation

`.exw` is a project-file naming convention; its contents are JSON based on Excalidraw's version 2 document structure. An empty file starts like this:

```json
{
  "type": "excalidraw",
  "version": 2,
  "elements": [],
  "appState": {},
  "files": {}
}
```

On save, the script reads `localStorage["excalidraw"]` and `localStorage["excalidraw-state"]`, then writes `elements` and `appState` to the local file. The current implementation always writes `files: {}`. Embedded images, attachments and other binary resources may therefore not survive an automatic or manual save. Keep backups and validate files that contain those resources.

### Automatic temporary file

When a directory is connected, the script ensures that `Temporario.exw` exists in the selected directory's root. It opens this file as the initial workspace after loading or reconnecting. The file is intentionally visible and may be recreated if it is deleted through the sidebar.

### Privacy, security and network behavior

The add-on has no project-specific backend, external API or synchronization service. The browser reads and writes local files after the user grants access. The permission belongs to the site origin and can be revoked through Chrome settings.

The script also contains an `ESCUDO LOCAL` block that attempts to unregister Service Workers for the current origin and replaces `window.WebSocket` with an empty implementation. This appears intended to force a local-oriented workflow, but it is a broad change and may disable Excalidraw features such as real-time collaboration, offline caching or anything that depends on WebSocket or Service Worker. Review or remove that block if those features are required.

### Known limitations

- The script depends on Excalidraw internals such as `.excalidraw-container`, `localStorage["excalidraw"]` and `localStorage["excalidraw-state"]`.
- Only `.exw` files are shown in the tree.
- `files` is written as an empty object, so embedded resources may be lost.
- A file created outside the connected directory can open successfully but may not appear in the tree or be deletable from the sidebar.
- There is no conflict handling for multiple tabs, windows or external editors.
- The five-second refresh rereads the directory listing; it is not a native file-system watcher.
- There is no version history, recycle bin or built-in restore workflow.
- `.excalidraw-container` may change or disappear in a future Excalidraw release.
- The script intercepts saving and changes global page behavior, so it should remain scoped to the intended domain.

### Troubleshooting

If the sidebar does not appear, verify that the rule is enabled, that JavaScript and CSS were pasted into the correct fields, that the site pattern includes `https://excalidraw.com/*`, and that the page was reloaded after saving the rule. Check the Chrome DevTools Console for script errors.

If the directory picker does not open, click the button directly; picker APIs require a user gesture. If a previously connected directory becomes unavailable, click **Conectar Pasta** and grant permission again.

If a file is missing, confirm that it is inside the selected directory or a child directory, that its name ends in `.exw`, and that it is not actually named something like `file.exw.json` because of operating-system filename settings.

If saving fails, confirm that an active file exists and that write permission is still granted. Try `Ctrl+S`/`Cmd+S` and check the status message in the sidebar. Remember that the save path depends on the local-storage keys used by the current Excalidraw version.

If collaboration or offline mode stops working, review the `ESCUDO LOCAL` block described above.

### Repository layout

```text
Excalidraw_local_addon/
├── CSS.css    # Sidebar styling and Excalidraw layout shift
├── JS.js      # UI, file access, opening and saving logic
└── README.md  # This documentation
```

### Development and maintenance

There is no build step or npm dependency. Edit `JS.js` or `CSS.css`, paste the updated contents into the injection rule, reload Excalidraw, and test folder selection, opening, creation, saving, deletion, reconnection and tree refresh.

When publishing changes, document anything that affects filesystem permissions, the `.exw` format, autosave, WebSocket or Service Workers.

### Roadmap

- [x] Local folder navigation
- [x] Automatic saving
- [x] Multi-language interface
- [x] Light and dark themes
- [ ] Preserve embedded images and resources
- [ ] Restore deleted files
- [ ] Search projects
- [ ] Publish a packaged Chrome extension
- [ ] Rename files from the sidebar

### Support the project

If this addon helps you organize your Excalidraw projects, consider giving the repository a ⭐ **Star**.

Use **Watch** to receive updates, open an [Issue](../../issues) to report a bug or suggest an improvement, and submit a [Pull Request](../../pulls) if you would like to contribute.

### License

No license is currently defined in this repository. Before publishing a public release, add a `LICENSE` file that matches how you want others to use, modify and redistribute the code.

### References

- [Excalidraw](https://excalidraw.com/)
- [File System Access API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)
- [`showDirectoryPicker()` — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker)
- [File System Access API — Chrome for Developers](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access)
- [User JavaScript and CSS v3.1.2 — Chrome Web Store](https://chromewebstore.google.com/detail/nbhcbdghjpllgmfilhnhkllmkecfmpld?utm_source=item-share-cb)
