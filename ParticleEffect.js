// 粒子特效
var ParticleEffect = {
    ctx: null,
    canvas: null,
    particles: [],
    options: {

    },
    init: function() {

        var windowSize = Utils.getWindowSize();
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // 只有在浏览器支持canvas的情况下才有效
        if(this.ctx) {
            this.canvas.width = windowSize.width;
            this.canvas.height = windowSize.height;

            this.particles = new Array(100).fill().map(function() {
                return new Particle({
                    x: Utils.rangeRandom(10, windowSize.width - 10),
                    y: Utils.rangeRandom(10, windowSize.height - 10),
                    vx: Utils.rangeRandom(-1.2, 1.2),
                    vy: Utils.rangeRandom(-1.2, 1.2),
                    color: 'rgba(255,255,255,.2)',
                    scale: Utils.rangeRandom(0.8, 1.2),
                    radius: 10
                });
            });
        }
    },
    move: function() {

        // 更新粒子坐标
        this.particles.forEach(function(item) {
            item.x += item.vx;
            item.y += item.vy;
        });

        // 检测粒子与墙壁的碰撞
        this.checkCollision();
    },
    checkCollision: function() {

        var windowSize = Utils.getWindowSize();

        this.particles.forEach(function(item) {

            // 如果粒子碰到了 左墙壁 或 右墙壁，则改变粒子的横向运动方向
            if((item.x - item.radius < 0) || (item.x + item.radius > windowSize.width)) {
                item.vx *= -1;
            }

            // 如果粒子碰到了 上墙壁 或 下墙壁，则改变粒子的纵向运动方向
            if((item.y - item.radius < 0) || (item.y + item.radius > windowSize.height)) {
                item.vy *= -1;
            }
        });
    },
    draw: function() {

        var _this = this;
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
                if(distance < 100) {
                    this.ctx.strokeStyle = 'rgba(255,255,255,' + (1 - distance / 100) * .3 + ')';
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.closePath();
                    this.ctx.stroke();
                }
            }
        }

        // 粒子移动，更新相应的x, y坐标
        this.move();
    },
    run: function() {
        this.init();
        setInterval(this.draw.bind(this), 1000 / 60);
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