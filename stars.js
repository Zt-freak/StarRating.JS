class StarContainer {
    constructor (element, starConfig) {
        if (element instanceof HTMLElement) {
            this.element = element;
            if (!this.element.classList.contains('star-container'))
                this.element.classList.toggle('star-container');
        }
        else {
            console.error('element must be a HTMLElement');
        }
        this.starConfig = starConfig;
    }

    render = (starData) => {
        this.element.innerHTML = '';
        let starAmount;
        let star;
        for (let i = 1; i <= starData.maxValue; i++) {
            
            if (starData.value >= i) {
                starAmount = 10
            }
            else if (starData.value < i && starData.value > i - 1) {
                starAmount = (starData.value - Math.floor(starData.value)) * 10;
            }
            else {
                starAmount = 0;
            }
            star = new Star(starAmount, this.starConfig).getSVG();
            star.dataset.index = i - 1;
            this.element.appendChild(star);
        }
    }
}

class StarConfig {
    constructor (
        starWidth = 30,
        starHeight = 30,
        colorFilled = 'gold',
        colorEmpty = '#000',
        starPathType = 'polygon',
        starPath = '5,0.2 8.1,9.8 0,3.9 10,3.9 1.9,9.8',
        id = (Math.random() + 1).toString(36).substring(7)
    ) {
        this.starWidth = starWidth;
        this.starHeight = starHeight;
        this.colorFilled = colorFilled;
        this.colorEmpty =  colorEmpty;
        this.starPath = starPath;
        this.starPathType = starPathType;
        this.id = id;
    }
}

class StarData {
    constructor (value = 0, maxValue = 5) {
        this.value = value;
        this.maxValue = maxValue;
    }
}

class Star {
    constructor (value = 0, starConfig = new StarConfig()) {
        this.value = value;
        this.starConfig = starConfig;

        this.svg = this.getNode('svg', {
            width: this.starConfig.starWidth,
            height: this.starConfig.starHeight,
            class: 'star-container__star'
        })
        this.styleElem = this.getNode('style', {
            type: "text/css"
        });
        switch (this.starConfig.starPathType) {
            case 'polygon':
                this.starPath = this.getNode('polygon', {
                    id: this.starConfig.id+"SVGID_1_",
                    points: this.starConfig.starPath
                });
                break;
            case 'path':
                this.starPath = this.getNode('path', {
                    id: this.starConfig.id+"SVGID_1_",
                    d: this.starConfig.starPath
                });
                break;

        }
        this.starPath.setAttributeNS(null, 'style', `transform:scale(${this.starConfig.starWidth / 10}, ${this.starConfig.starHeight / 10});`,);
        this.defs = this.getNode('defs', {});
        this.background = this.getNode('rect', {
            class: "st1",
            width: "100%",
            height: "100%"
        });
        this.background.style.fill = this.starConfig.colorEmpty;
        this.filled = this.getNode('rect',  {
            class: "st2",
            width: "100%",
            height: "100%"
        });
        this.filled.style.fill = this.starConfig.colorFilled;
        this.starClip = this.getNode('clipPath', {
            id: this.starConfig.id+"SVGID_2_"
        });
        this.starClipUse = this.getNode('use', {});
        this.starClipUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#'+this.starConfig.id+'SVGID_1_');
        this.gaugeGroup = this.getNode('g', {
            class: "st0"
        });
        this.starGroup = this.getNode('g', {});
    }

    getNode = (n, v) => {
    n = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (let p in v)
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return '-' + m.toLowerCase(); }), v[p]);
    return n
    }

    assembleStar = () => {
        this.svg.appendChild(this.starGroup);
            this.starGroup.appendChild(this.styleElem);
            this.starGroup.appendChild(this.defs);
                this.defs.appendChild(this.starPath);
            this.starGroup.appendChild(this.starClip);
                this.starClip.appendChild(this.starClipUse);
            this.starGroup.appendChild(this.gaugeGroup);
                this.gaugeGroup.style.clipPath = 'url(#'+this.starConfig.id+'SVGID_2_)'
                this.gaugeGroup.appendChild(this.background);
                this.gaugeGroup.appendChild(this.filled);

        this.filled.setAttributeNS(null, 'width', 100 / 10 * this.value +"%")
    }

    getSVG = () => {
        this.assembleStar();
        return this.svg;
    }
}