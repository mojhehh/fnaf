// 资源管理器
class AssetManager {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.loaded = false;
    }

    async loadAssets() {
        // 获取当前脚本的基础路径
        const basePath = this.getBasePath();
        
        // 从 Unity 提取的资源
        const imagePaths = {
            office: `${basePath}assets/images/original.png`,
            cam1: `${basePath}assets/images/Cam1.png`,
            cam2: `${basePath}assets/images/Cam2.png`,
            cam3: `${basePath}assets/images/Cam3.png`,
            cam4: `${basePath}assets/images/Cam4.png`,
            cam5: `${basePath}assets/images/Cam5.png`,
            cam6: `${basePath}assets/images/Cam6.png`,
            cam7: `${basePath}assets/images/Cam7.png`,
            cam8: `${basePath}assets/images/Cam8.png`,
            cam9: `${basePath}assets/images/Cam9.png`,
            cam10: `${basePath}assets/images/Cam10.png`,
            cam11: `${basePath}assets/images/Cam11.png`,
            jumpscare: `${basePath}assets/images/jump.png`, // EP跳杀图片
            trumpJumpscare: `${basePath}assets/images/jumptrump.png`, // Trump跳杀图片
            hawkingJumpscare: `${basePath}assets/images/scaryhawking.png`, // Hawking跳杀图片
        };

        const soundPaths = {
            ambient: `${basePath}assets/sounds/music.ogg`,
            static: `${basePath}assets/sounds/Static_sound.ogg`,
            staticLoop: `${basePath}assets/sounds/Static_sound.ogg`,
            vents: `${basePath}assets/sounds/vents.ogg`,
            ventCrawling: `${basePath}assets/sounds/vent-crawling.mp3`,
            jumpscare: `${basePath}assets/sounds/jumpcare.ogg`,
            hawkingJumpscare: `${basePath}assets/sounds/stephenjumpscare.ogg`, // Hawking跳杀音效
            blip: `${basePath}assets/sounds/Blip.ogg`,
            win: `${basePath}assets/sounds/winmusic.ogg`,
            chimes: `${basePath}assets/sounds/chimes.ogg`,
            crank1: `${basePath}assets/sounds/Crank1.ogg`,
            crank2: `${basePath}assets/sounds/Crank2.ogg`,
            ekg: `${basePath}assets/sounds/ekg.wav`,
            hawking_shock: `${basePath}assets/sounds/hawking_shock.wav`,
            goldenstephenscare: `${basePath}assets/sounds/goldenstephenscare.ogg`, // Golden 霍金音效
        };

        // 加载图片
        for (const [key, path] of Object.entries(imagePaths)) {
            try {
                this.images[key] = await this.loadImage(path);
            } catch (e) {
                console.warn(`Failed to load image: ${path}`);
            }
        }

        // 加载音频 - with cache busting to avoid stale SW cache
        const cacheBust = '?v=' + Date.now();
        for (const [key, path] of Object.entries(soundPaths)) {
            try {
                const audio = new Audio();
                audio.preload = 'auto';
                audio.src = path + cacheBust;
                this.sounds[key] = audio;
            } catch (e) {
                console.warn(`Failed to load sound: ${path}`);
            }
        }

        this.loaded = true;
    }

    getBasePath() {
        // 本地开发环境 - 始终使用相对路径
        return './';
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    playSound(key, loop = false, volume = 1.0) {
        if (this.sounds[key]) {
            const audio = this.sounds[key];
            // If audio has no valid source, try to reload it
            if (audio.error || audio.networkState === 3) {
                const src = audio.src.split('?')[0];
                audio.src = src + '?v=' + Date.now();
                audio.load();
            }
            audio.loop = loop;
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play().catch(e => console.warn(`Audio play failed for ${key}:`, e.message));
        }
    }

    stopSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    }

    setSoundVolume(key, volume) {
        if (this.sounds[key]) {
            this.sounds[key].volume = volume;
        }
    }
}
