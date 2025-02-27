class AppWindow {
    constructor(appId, appContent, taskbar) {
        this.appId = appId;
        this.title = appContent[appId]?.title;
        this.content = appContent[appId]?.content;
        this.background = appContent[appId]?.background;
        this.open = false;
        this.taskbar = taskbar;
        this.createWindow();
    }

    createWindow() {
        let windowsContainer = document.getElementById('windows-container');
        this.window = document.createElement('div');
        this.window.classList.add('window');
        this.window.id = this.appId;
        this.window.innerHTML = `
            <div class="window-header">
                <span>${this.title}</span>
                <div>
                    <button onclick="windowManager.getApp('${this.appId}').minimize()">-</button>
                    <button onclick="windowManager.getApp('${this.appId}').maximize()">□</button>
                    <button onclick="windowManager.getApp('${this.appId}').close()">x</button>
                </div>
            </div>
            <div class="window-body" style="padding: 10px; background: url('${this.background}') no-repeat center center; background-size: auto;">
                ${this.content}
            </div>
        `;
        this.window.style.top = '100px';
        this.window.style.left = '100px';
        this.window.style.display = 'block';

        windowsContainer.appendChild(this.window);
        this.makeDraggable();
        this.activate();
        this.isOpen = true;
    }
    
    close() {
        event.stopPropagation();
        this.window.remove();
        this.taskbar.classList.remove('open', 'active');
        this.open = false;
    }
    
    minimize() {
        console.log('Minimizing');
        event.stopPropagation();
        this.taskbar.classList.remove('active');
        this.taskbar.classList.add('open');
        this.window.style.display = 'none';
        this.open = false;
    }
    
    maximize() {
        event.stopPropagation();
        
        if (this.window.contains('fullscreen')) {
            this.window.style.width = '400px';
            this.window.style.height = '300px';
            this.window.classList.remove('fullscreen');
        } else {
            this.window.classList.add('fullscreen');
            this.window.style.width = '100vw'
            this.window.style.height = (window.innerHeight - 50) + 'px';
            this.window.style.top = '0';
            this.window.style.left = '0';
        }
    }
    
    // Function to enable dragging
    makeDraggable() {
        let offsetX, offsetY, isDragging = false;
        let header = this.window.querySelector('.window-header');
    
        header.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - this.window.getBoundingClientRect().left;
            offsetY = event.clientY - this.window.getBoundingClientRect().top;
            
            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.removeEventListener('mousemove', moveWindow);
            });
        });
    
        function moveWindow(event) {
            if (!isDragging) return;
    
            let maxX = window.innerWidth - this.window.offsetWidth;
            let maxY = window.innerHeight - this.window.offsetHeight - 50; // Prevent covering taskbar
    
            let newX = event.clientX - offsetX;
            let newY = event.clientY - offsetY;
    
            // Ensure window stays within bounds
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
    
            this.window.style.left = newX + 'px';
            this.window.style.top = newY + 'px';
        }
    }

    activate() {
    
        let allWindows = document.querySelectorAll(".window");
        zCount++;
        this.window.style.zIndex = zCount;

        allWindows.forEach(win => {
            win.classList.remove("active");
            document.getElementById('taskbar-' + win.id).classList.remove("active", 'open');
        });

        this.window.classList.add("active");
        this.taskbar.classList.add('active');
    }

}

class WindowManager {
    constructor() {
        this.apps = {};
        this.loadContent();
        this.setupEventListeners();
    }

    loadContent() {
        fetch('content.json')
            .then(response => response.json())
            .then(data => {this.apps = data});
    }

    openApp(appId) {
        event.stopPropagation();
        console.log(`Opening app: ${appId}`);

        let taskbar = document.getElementById('taskbar-' + appId);
        if (typeof(this.apps[appId]) === 'object') {
            if(this.apps[appId].isOpen) {
                console.log('Already open');
                this.apps[appId].minimize();
                this.apps[appId].taskbar.classList.add('open');
            } else {
                this.apps[appId].window.style.display = 'block';
                this.apps[appId].activate();
                this.apps[appId].isOpen = true;
                this.apps[appId].taskbar.classList.add('active');
            }
            return;
        }

        let appData = this.apps[appId];
        console.log(appData);
        this.apps[appId] = new AppWindow(appId, appData, taskbar);
    }

    setupEventListeners() {
        document.addEventListener("click", (event) => {
            let clickedWindow = event.target.closest(".window");
            if (clickedWindow) {
                this.apps[clickedWindow.id].activate();
            }
        });

        document.querySelectorAll(".icon").forEach(icon => {
            icon.addEventListener("dblclick", () => {
                let appId = icon.getAttribute("data-app");
                this.openApp(appId);
            });
        });
    }
}

let zCount = 10;
let windowManager = new WindowManager();

function closeWebsite() {
    window.close();
}