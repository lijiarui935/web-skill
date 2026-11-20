/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：首页 Canvas 粒子连线动画 + 健康检查接口探测
 */
(function () {
    'use strict';

    // 李嘉蕊：Canvas 粒子连线，节点数量随宽度自适应
    var LJR_canvas = document.getElementById('LJR_canvas');
    if (LJR_canvas && LJR_canvas.getContext) {
        var LJR_ctx = LJR_canvas.getContext('2d');
        var LJR_dots = [];
        var LJR_raf = 0;
        var LJR_dpr = Math.min(window.devicePixelRatio || 1, 2);
        var LJR_linkDist = 130;

        function LJR_resize() {
            var LJR_box = LJR_canvas.getBoundingClientRect();
            LJR_canvas.width = Math.round(LJR_box.width * LJR_dpr);
            LJR_canvas.height = Math.round(LJR_box.height * LJR_dpr);
            LJR_ctx.setTransform(LJR_dpr, 0, 0, LJR_dpr, 0, 0);

            var LJR_count = Math.max(28, Math.round(LJR_box.width / 22));
            LJR_dots = [];
            for (var LJR_i = 0; LJR_i < LJR_count; LJR_i++) {
                LJR_dots.push({
                    x: Math.random() * LJR_box.width,
                    y: Math.random() * LJR_box.height,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 1.6 + 0.7
                });
            }
        }

        function LJR_draw() {
            var LJR_box = LJR_canvas.getBoundingClientRect();
            var LJR_w = LJR_box.width;
            var LJR_h = LJR_box.height;
            LJR_ctx.clearRect(0, 0, LJR_w, LJR_h);

            // 李嘉蕊：先把连线画在底层，粒子压在上面，层次更清楚
            for (var LJR_i = 0; LJR_i < LJR_dots.length; LJR_i++) {
                var LJR_a = LJR_dots[LJR_i];
                LJR_a.x += LJR_a.vx;
                LJR_a.y += LJR_a.vy;
                if (LJR_a.x < 0 || LJR_a.x > LJR_w) LJR_a.vx *= -1;
                if (LJR_a.y < 0 || LJR_a.y > LJR_h) LJR_a.vy *= -1;

                for (var LJR_j = LJR_i + 1; LJR_j < LJR_dots.length; LJR_j++) {
                    var LJR_b = LJR_dots[LJR_j];
                    var LJR_dx = LJR_a.x - LJR_b.x;
                    var LJR_dy = LJR_a.y - LJR_b.y;
                    var LJR_dist = Math.sqrt(LJR_dx * LJR_dx + LJR_dy * LJR_dy);
                    if (LJR_dist < LJR_linkDist) {
                        LJR_ctx.strokeStyle = 'rgba(94, 224, 208, ' + (0.16 * (1 - LJR_dist / LJR_linkDist)) + ')';
                        LJR_ctx.lineWidth = 1;
                        LJR_ctx.beginPath();
                        LJR_ctx.moveTo(LJR_a.x, LJR_a.y);
                        LJR_ctx.lineTo(LJR_b.x, LJR_b.y);
                        LJR_ctx.stroke();
                    }
                }
            }

            for (var LJR_k = 0; LJR_k < LJR_dots.length; LJR_k++) {
                var LJR_d = LJR_dots[LJR_k];
                LJR_ctx.beginPath();
                LJR_ctx.fillStyle = LJR_k % 5 === 0 ? 'rgba(255, 184, 107, .9)' : 'rgba(160, 190, 255, .85)';
                LJR_ctx.arc(LJR_d.x, LJR_d.y, LJR_d.r, 0, Math.PI * 2);
                LJR_ctx.fill();
            }

            LJR_raf = window.requestAnimationFrame(LJR_draw);
        }

        LJR_resize();
        LJR_draw();

        var LJR_timer = 0;
        window.addEventListener('resize', function () {
            window.clearTimeout(LJR_timer);
            LJR_timer = window.setTimeout(function () {
                window.cancelAnimationFrame(LJR_raf);
                LJR_resize();
                LJR_draw();
            }, 160);
        });
    }

    // 李嘉蕊：首页顺手探一下后端，把结果打到控制台并显示在页面
    var LJR_healthUrl = document.getElementById('LJR_health_url');
    var LJR_healthLink = document.getElementById('LJR_health_link');
    var LJR_healthState = document.getElementById('LJR_health_state');
    var LJR_full = window.location.origin + '/api/health';
    if (LJR_healthUrl) LJR_healthUrl.textContent = LJR_full;
    if (LJR_healthLink) LJR_healthLink.href = '/api/health';

    fetch('/api/health')
        .then(function (LJR_res) { return LJR_res.json(); })
        .then(function (LJR_data) {
            console.log('[health] 后端返回：', LJR_data);
            if (LJR_healthState) {
                LJR_healthState.textContent = LJR_data.code === 0 ? '后端已连接 ✓' : '后端返回异常';
            }
        })
        .catch(function (LJR_err) {
            console.error('[health] 请求失败：', LJR_err);
            if (LJR_healthState) {
                LJR_healthState.textContent = '后端未启动（请先运行 start.bat）';
            }
        });
})();
