// ==========================================
// IG GLOBAL ANALYSIS TOOL (REST API VERSION)
// ==========================================

(async function () {
    if (document.getElementById('ig-global-panel')) {
        alert("Panel is already open / Panel zaten açık");
        return;
    }

    // --- DİL SÖZLÜĞÜ (DICTIONARY) ---
    const LANG = {
        en: { flag: "🇬🇧", name: "English", title: "Analysis Status", start: "Initializing...", error_login: "Error: Not logged in.", fetch: "Fetching", comparing: "Comparing lists...", total_following: "Following", total_followers: "Followers", not_following_back: "Not Following Back", error: "Error", wait: "Please wait...", completed: "Analysis Completed" },
        tr: { flag: "🇹🇷", name: "Türkçe", title: "Analiz Durumu", start: "Başlatılıyor...", error_login: "Hata: Giriş yapılmamış.", fetch: "Çekiliyor", comparing: "Listeler karşılaştırılıyor...", total_following: "Takip Edilen", total_followers: "Takipçi", not_following_back: "Geri Takip Etmeyenler", error: "Hata", wait: "Lütfen bekleyin...", completed: "Analiz Tamamlandı" },
        ru: { flag: "🇷🇺", name: "Русский", title: "Статус анализа", start: "Запуск...", error_login: "Ошибка: Вход не выполнен.", fetch: "Получение", comparing: "Сравнение списков...", total_following: "Подписки", total_followers: "Подписчики", not_following_back: "Не подписаны взаимно", error: "Ошибка", wait: "Подождите...", completed: "Анализ завершен" },
        zh: { flag: "🇨🇳", name: "中文", title: "分析状态", start: "正在初始化...", error_login: "错误：未登录。", fetch: "正在获取", comparing: "正在比较列表...", total_following: "关注中", total_followers: "粉丝", not_following_back: "未回关", error: "错误", wait: "请稍候...", completed: "分析完成" },
        es: { flag: "🇪🇸", name: "Español", title: "Estado del análisis", start: "Iniciando...", error_login: "Error: No has iniciado sesión.", fetch: "Obteniendo", comparing: "Comparando listas...", total_following: "Siguiendo", total_followers: "Seguidores", not_following_back: "No te siguen de vuelta", error: "Error", wait: "Por favor espere...", completed: "Análisis completado" },
        fr: { flag: "🇫🇷", name: "Français", title: "Statut de l'analyse", start: "Lancement...", error_login: "Erreur : Non connecté.", fetch: "Récupération", comparing: "Comparaison des listes...", total_following: "Abonnements", total_followers: "Abonnés", not_following_back: "Ne vous suit pas en retour", error: "Erreur", wait: "Veuillez patienter...", completed: "Analyse terminée" },
        it: { flag: "🇮🇹", name: "Italiano", title: "Stato Analisi", start: "Inizializzazione...", error_login: "Errore: Non connesso.", fetch: "Recupero", comparing: "Confronto liste...", total_following: "Seguiti", total_followers: "Follower", not_following_back: "Non ricambia", error: "Errore", wait: "Attendere prego...", completed: "Analisi Completata" }
    };

    let currentLang = 'en';
    
    const DELAY_MIN = 2000; 
    const DELAY_MAX = 4500; 
    const APP_ID = '936619743392459'; // Instagram Resmi Web APP ID (REST API için zorunlu)

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const randomDelay = () => Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1) + DELAY_MIN);
    const getText = (key) => LANG[currentLang][key] || key;

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const createUI = () => {
        const panel = document.createElement('div');
        panel.id = 'ig-global-panel';
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: 380px; height: 700px;
            background-color: #1c1e21; color: #e4e6eb; z-index: 9999999;
            border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex; flex-direction: column; border: 1px solid #3e4042; font-size: 14px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `padding: 15px; border-bottom: 1px solid #3e4042; background-color: #242526; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;`;
        
        const langSelect = document.createElement('select');
        langSelect.id = 'ig-lang-select';
        langSelect.style.cssText = `background: #3a3b3c; color: white; border: none; padding: 5px; border-radius: 5px; cursor: pointer; outline: none; font-size: 12px;`;
        
        Object.keys(LANG).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = `${LANG[key].flag} ${LANG[key].name}`;
            if(key === currentLang) opt.selected = true;
            langSelect.appendChild(opt);
        });

        const titleSpan = document.createElement('span');
        titleSpan.id = 'ig-header-title';
        titleSpan.style.fontWeight = 'bold';
        titleSpan.innerText = getText('title');

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✖';
        closeBtn.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:18px;";
        closeBtn.onclick = () => panel.remove();

        const leftContainer = document.createElement('div');
        leftContainer.style.display = 'flex';
        leftContainer.style.alignItems = 'center';
        leftContainer.style.gap = '10px';
        leftContainer.appendChild(langSelect);
        leftContainer.appendChild(titleSpan);

        header.appendChild(leftContainer);
        header.appendChild(closeBtn);

        const statusDiv = document.createElement('div');
        statusDiv.id = 'ig-analiz-status';
        statusDiv.style.cssText = `padding: 12px; background: #2a2c30; font-size: 13px; color: #b0b3b8; border-bottom: 1px solid #3e4042; transition: all 0.3s;`;
        statusDiv.innerText = getText('start');

        const content = document.createElement('div');
        content.id = 'ig-analiz-content';
        content.style.cssText = `flex: 1; overflow-y: auto; padding: 10px;`;

        panel.appendChild(header);
        panel.appendChild(statusDiv);
        panel.appendChild(content);
        document.body.appendChild(panel);

        langSelect.addEventListener('change', (e) => {
            currentLang = e.target.value;
            document.getElementById('ig-header-title').innerText = getText('title');
            const summaryDiv = document.getElementById('ig-result-summary');
            if (summaryDiv) updateResultSummary();
            else statusDiv.innerText = getText('wait');
        });

        return { statusDiv, content };
    };

    const ui = createUI();
    const userId = getCookie("ds_user_id");

    if (!userId) {
        ui.statusDiv.innerText = getText('error_login');
        return;
    }

    let globalFollowing = [];
    let globalFollowers = [];
    let globalFollowerSet = new Set();

    // --- REST API FETCH MOTORU (HASH GEREKTİRMEZ) ---
    async function fetchList(listType) {
        let hasNext = true;
        let maxId = '';
        let nodes = [];
        let count = 0;

        while (hasNext) {
            // API V1 endpointi
            const url = `https://www.instagram.com/api/v1/friendships/${userId}/${listType}/?count=50${maxId ? '&max_id=' + maxId : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'x-ig-app-id': APP_ID,
                    'x-ig-www-claim': '0',
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                if (response.status === 429) throw new Error("Rate Limit: Çok hızlı istek atıldı, lütfen 5-10 dk bekleyip tekrar deneyin.");
                throw new Error(`Network Error (${response.status})`);
            }

            const json = await response.json();
            
            if (!json.users) throw new Error("Data Error: Users array not found");

            const newNodes = json.users;
            nodes = [...nodes, ...newNodes];
            count += newNodes.length;

            hasNext = !!json.next_max_id;
            maxId = json.next_max_id || '';

            const listName = listType === 'following' ? getText('total_following') : getText('total_followers');
            ui.statusDiv.innerText = `${getText('fetch')}: ${count} (${listName})...`;

            if (hasNext) await sleep(randomDelay());
        }
        return nodes;
    }

    function updateResultSummary() {
        // REST API verisinde ID alanı "pk" veya "id" olarak döner.
        const notBackCount = globalFollowing.length - [...globalFollowerSet].filter(id => globalFollowing.some(f => (f.pk || f.id) === id)).length;
        
        ui.statusDiv.innerHTML = `
            <div id="ig-result-summary">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>${getText('total_following')}:</span> <strong style="color:white">${globalFollowing.length}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>${getText('total_followers')}:</span> <strong style="color:white">${globalFollowers.length}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; color:#F44336; border-top:1px solid #444; padding-top:4px; margin-top:4px;">
                    <span>${getText('not_following_back')}:</span> <strong>${notBackCount}</strong>
                </div>
                <div style="text-align:center; margin-top:5px; color:#4CAF50; font-size:11px;">✔ ${getText('completed')}</div>
            </div>
        `;
    }

    try {
        // Hash karmaşası yerine doğrudan REST API uç noktaları çağrılır
        globalFollowing = await fetchList('following');
        globalFollowers = await fetchList('followers');

        ui.statusDiv.innerText = getText('comparing');
        
        // ID'leri kaydet (REST verisinde 'pk' veya 'id' olabilir)
        globalFollowerSet = new Set(globalFollowers.map(u => u.pk || u.id));
        
        const sortedFollowing = globalFollowing.sort((a, b) => {
            const aId = a.pk || a.id;
            const bId = b.pk || b.id;
            const aBack = globalFollowerSet.has(aId);
            const bBack = globalFollowerSet.has(bId);
            return aBack === bBack ? 0 : aBack ? 1 : -1;
        });

        const ul = document.createElement('ul');
        ul.style.listStyle = "none";
        ul.style.padding = "0";

        sortedFollowing.forEach(user => {
            const userId = user.pk || user.id;
            const followsBack = globalFollowerSet.has(userId);
            const li = document.createElement('li');
            li.style.cssText = `
                display: flex; align-items: center; padding: 8px;
                border-bottom: 1px solid #2a2c30;
                background: ${followsBack ? 'transparent' : 'rgba(244, 67, 54, 0.15)'};
            `;
            
            li.innerHTML = `
                <a href="https://www.instagram.com/${user.username}/" target="_blank" style="text-decoration:none; display:flex; align-items:center; flex:1; color:inherit;">
                    <img src="${user.profile_pic_url}" style="width:40px; height:40px; border-radius:50%; margin-right:10px; object-fit:cover;">
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:600; overflow:hidden; text-overflow:ellipsis;">${user.username}</div>
                        <div style="font-size:12px; color:#aaa; overflow:hidden; text-overflow:ellipsis;">${user.full_name || ''}</div>
                    </div>
                </a>
                <div style="margin-left:10px; font-size:18px;">
                    ${followsBack 
                        ? '<span style="color:#4CAF50;" title="Follows You">✔</span>' 
                        : '<span style="color:#F44336; font-weight:bold;" title="Not Following Back">✖</span>'}
                </div>
            `;
            ul.appendChild(li);
        });

        ui.content.innerHTML = "";
        ui.content.appendChild(ul);

        updateResultSummary();

    } catch (err) {
        console.error(err);
        ui.statusDiv.innerHTML = `<span style="color:#F44336;">${getText('error')}: ${err.message}</span>`;
    }

})();