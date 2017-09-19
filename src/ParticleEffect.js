// 粒子特效
var ParticleEffect = {
    ctx: null,
    canvas: null,
    particles: [],
    mouseCoordinates: {x: 0, y: 0},
    config: {
        radius: 5,                      // 默认粒子半径
        vxRange: [-1, 1],               // 默认粒子横向移动速度范围
        vyRange: [-1, 1],               // 默认粒子纵向移动速度范围
        scaleRange: [.5, 1],            // 默认粒子缩放比例范围
        lineLenThreshold: 125,          // 默认连线长度阈值
        color: 'rgba(255,255,255,.2)'   // 默认粒子、线条的颜色
    },
    init: function(newConfig) {

        var _this = this;
        var windowSize = Utils.getWindowSize();
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // 只有在浏览器支持canvas的情况下才有效
        if(this.ctx) {

            // 设置canvas宽高
            this.canvas.width = windowSize.width;
            this.canvas.height = windowSize.height;

            // 更新config配置
            newConfig && Object.keys(newConfig).forEach(function(key) {
                _this.config[key] = newConfig[key];
            });

            // 生成粒子
            var times = 100;
            this.particles = [];
            while(times--) {
                this.particles.push(new Particle({
                    x: Utils.rangeRandom(this.config.radius, windowSize.width - this.config.radius),
                    y: Utils.rangeRandom(this.config.radius, windowSize.height - this.config.radius),
                    vx: Utils.rangeRandom(this.config.vxRange[0], this.config.vxRange[1]),
                    vy: Utils.rangeRandom(this.config.vyRange[0], this.config.vyRange[1]),
                    color: this.config.color,
                    scale: Utils.rangeRandom(this.config.scaleRange[0], this.config.scaleRange[1]),
                    radius: this.config.radius
                }));
            }

            // 监听鼠标的mouseMove事件，记录下鼠标的x,y坐标
            window.addEventListener('mousemove', this.handleMouseMove.bind(this), false);

            // 监听窗口大小改变事件
            window.addEventListener('resize', this.handleWindowResize.bind(this), false);

            // 兼容requestAnimationFrame
            this.supportRequestAnimationFrame();
        }
    },
    move: function() {

        var windowSize = Utils.getWindowSize();

        this.particles.forEach(function(item) {

            // 更新粒子坐标
            item.x += item.vx;
            item.y += item.vy;

            // 如果粒子碰到了左墙壁或右墙壁，则改变粒子的横向运动方向
            if((item.x - item.radius < 0) || (item.x + item.radius > windowSize.width)) {
                item.vx *= -1;
            }

            // 如果粒子碰到了上墙壁或下墙壁，则改变粒子的纵向运动方向
            if((item.y - item.radius < 0) || (item.y + item.radius > windowSize.height)) {
                item.vy *= -1;
            }
        });
    },
    draw: function() {

        var _this = this;
        var lineLenThreshold = this.config.lineLenThreshold;
        var windowSize = Utils.getWindowSize();

        // 每次重新绘制之前，需要先清空画布，把上一次的内容清空
        this.ctx.clearRect(0, 0, windowSize.width, windowSize.height);

        // 绘制粒子
        this.particles.forEach(function(item) {
            item.draw(_this.ctx);
        });

        // 绘制粒子之间的连线
        for(var i = 0; i < this.particles.length; i++) {
            for(var j = i + 1; j < this.particles.length; j++) {
                var distance = Math.sqrt(Math.pow(this.particles[i].x - this.particles[j].x, 2) + Math.pow(this.particles[i].y - this.particles[j].y, 2));
                if(distance < lineLenThreshold) {
                    // 这里我们让距离远的线透明度淡一点，距离近的线透明度深一点
                    this.ctx.strokeStyle = 'rgba(255,255,255,' + (1 - distance / lineLenThreshold) * .2 + ')';
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.closePath();
                    this.ctx.stroke();
                }
            }
        }

        // 绘制粒子和鼠标之间的连线
        for(i = 0; i < this.particles.length; i++) {
            distance = Math.sqrt(Math.pow(this.particles[i].x - this.mouseCoordinates.x, 2) + Math.pow(this.particles[i].y - this.mouseCoordinates.y, 2));
            if(distance < lineLenThreshold) {
                this.ctx.strokeStyle = 'rgba(255,255,255,' + (1 - distance / lineLenThreshold) * .2 + ')';
                this.ctx.beginPath();
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(this.mouseCoordinates.x, this.mouseCoordinates.y);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }

        // 粒子移动，更新相应的x, y坐标
        this.move();

        // 循环调用draw方法
        window.requestAnimationFrame(this.draw.bind(this));
    },
    handleMouseMove: function(event) {

        var x, y;
        event = event || window.event;

        if(event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        this.mouseCoordinates = {x: x, y: y};
    },
    handleWindowResize: function() {
        var windowSize = Utils.getWindowSize();
        this.canvas.width = windowSize.width;
        this.canvas.height = windowSize.height;
    },
    supportRequestAnimationFrame: function() {
        if(!window.requestAnimationFrame) {
            window.requestAnimationFrame = (
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    setInterval(callback, 1000 / 60)
                }
            );
        }
    },
    run: function(config) {
        this.init(config);
        window.requestAnimationFrame(this.draw.bind(this));
    }
};

/**
 * Particle 粒子类
 */
function Particle(attr) {

    // 粒子属性
    this.x = attr.x;            // 粒子在画布中的横坐标
    this.y = attr.y;            // 粒子在画布中的纵坐标
    this.vx = attr.vx;          // 粒子的横向运动速度
    this.vy = attr.vy;          // 粒子的纵向运动速度
    this.color = attr.color;    // 粒子的颜色
    this.scale = attr.scale;    // 粒子的缩放比例
    this.radius = attr.radius;  // 粒子的半径大小

    // 绘制方法
    if(typeof Particle.prototype.draw === 'undefined') {
        Particle.prototype.draw = function(ctx) {
            // canvas画圆方法
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.arc(this.x, this.y, this.radius * this.scale, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
        }
    }
}

// 工具
var Utils = {
    getWindowSize: function() {
        return {
            width: this.getWindowWidth(),
            height: this.getWindowHeight()
        };
    },
    getWindowWidth: function() {
        return window.innerWidth || document.documentElement.clientWidth;
    },
    getWindowHeight: function() {
        return window.innerHeight || document.documentElement.clientHeight;
    },
    rangeRandom: function(min, max) {
        const diff = max - min;
        return min + Math.random() * diff;
    }
};