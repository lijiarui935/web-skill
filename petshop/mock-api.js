/* 李嘉蕊 24002120526 · 《高级网页设计》
 * 豆栗喵屋 —— 纯静态 Mock 后端（方案 A）
 * 作用：在不启动任何服务器的前提下，拦截页面发出的 /api/* 请求，
 *       用真实采集到的商品/套餐数据 + localStorage 持久化，模拟全部 53 个接口。
 * 说明：真实后端使用 { code, message, data } 的统一响应结构，这里完全对齐；
 *       登录态沿用页面自己的 douli_token / douli_user。
 */
(function () {
    'use strict';

    if (window.LJR_MOCK_API) { return; }
    window.LJR_MOCK_API = true;

    var LJR_SEED = window.LJR_SEED || { products: [], categories: [], packages: [] };
    var LJR_STORE_KEY = 'ljr_petshop_db_v3';
    var LJR_DB = null;

    /* ---------------- 时间与小工具 ---------------- */
    function LJR_pad(n) { return n < 10 ? '0' + n : '' + n; }

    function LJR_now() {
        var d = new Date();
        return d.getFullYear() + '-' + LJR_pad(d.getMonth() + 1) + '-' + LJR_pad(d.getDate()) + ' ' +
            LJR_pad(d.getHours()) + ':' + LJR_pad(d.getMinutes()) + ':' + LJR_pad(d.getSeconds());
    }

    function LJR_day(offset) {
        var d = new Date();
        d.setDate(d.getDate() + offset);
        return LJR_pad(d.getMonth() + 1) + '-' + LJR_pad(d.getDate());
    }

    function LJR_date(d) {
        if (!d) { return ''; }
        if (typeof d === 'string') { return d.slice(0, 10); }
        return d.getFullYear() + '-' + LJR_pad(d.getMonth() + 1) + '-' + LJR_pad(d.getDate());
    }

    function LJR_money(n) { return Math.round(Number(n || 0) * 100) / 100; }

    function LJR_clone(v) { return JSON.parse(JSON.stringify(v)); }

    function LJR_ok(data, message) {
        return { status: 200, body: { code: 200, message: message || '操作成功', data: data === undefined ? null : data } };
    }

    function LJR_fail(message) {
        return { status: 200, body: { code: 500, message: message || '操作失败', data: null } };
    }

    /* ---------------- 初始化数据 ---------------- */
    function LJR_init() {
        var products = [];
        var reviews = [];
        (LJR_SEED.products || []).forEach(function (item) {
            if (item && item.product) { products.push(LJR_clone(item.product)); }
            (item && item.reviews || []).forEach(function (r) { reviews.push(LJR_clone(r)); });
        });

        var users = [
            {
                id: 1, username: 'admin', password: '123456', nickname: '豆栗店长', phone: '13800000001',
                email: 'admin@douli.com', avatar: null, role: 'ADMIN', status: 1,
                bio: '豆栗喵屋主理人，养了两只猫一只狗，欢迎来店里撸猫。', createdAt: '2026-11-19 15:16:59'
            },
            {
                id: 2, username: 'douli', password: '123456', nickname: '豆栗铲屎官', phone: '13800000002',
                email: 'douli@example.com', avatar: null, role: 'USER', status: 1,
                bio: '家有橘猫「豆豆」和布偶「栗子」，最爱给它们囤零食。', createdAt: '2026-11-19 15:16:59'
            }
        ];

        return {
            version: 3,
            users: users,
            products: products,
            reviews: reviews,
            categories: LJR_clone(LJR_SEED.categories || []),
            packages: LJR_clone(LJR_SEED.packages || []),
            carts: {},
            addresses: {
                2: [{
                    id: 1, userId: 2, receiver: '王豆栗', phone: '13800000002',
                    province: '辽宁省', city: '沈阳市', district: '浑南区',
                    detail: '全运路 88 号 豆栗公寓 3 单元 802', isDefault: true
                }]
            },
            orders: [{
                order: {
                    id: 2, orderNo: 'DL202611150002', userId: 2, totalAmount: 79.8, freight: 8,
                    payAmount: 87.8, status: 'SHIPPED', receiverName: '王豆栗', receiverPhone: '13800000002',
                    receiverAddress: '辽宁省沈阳市浑南区全运路 88 号 豆栗公寓 3 单元 802', remark: null,
                    logisticsNo: 'SF1234567890', createdAt: '2026-11-17 15:16:59',
                    payTime: '2026-11-17 15:16:59', shipTime: '2026-11-18 15:16:59', finishTime: null
                },
                items: [{
                    id: 3, orderId: 2, productId: 2, productName: '冻干鸡肉丁宠物零食 200g',
                    productImage: 'images/treats.jpg', price: 39.9, quantity: 2,
                    specs: '净含量 200g / 罐；配料：鸡胸肉 100%；保质期 12 个月'
                }]
            }, {
                order: {
                    id: 1, orderNo: 'DL202611010001', userId: 2, totalAmount: 118.9, freight: 0,
                    payAmount: 118.9, status: 'COMPLETED', receiverName: '王豆栗', receiverPhone: '13800000002',
                    receiverAddress: '辽宁省沈阳市浑南区全运路 88 号 豆栗公寓 3 单元 802', remark: null,
                    logisticsNo: null, createdAt: '2026-11-14 15:16:59', payTime: '2026-11-14 15:16:59',
                    shipTime: '2026-11-15 15:16:59', finishTime: '2026-11-16 15:16:59'
                },
                items: [{
                    id: 1, orderId: 1, productId: 1, productName: '豆栗全价冻干双拼猫粮 1.5kg',
                    productImage: 'images/cat-food.jpg', price: 89, quantity: 1,
                    specs: '净含量 1.5kg / 袋；粗蛋白≥40%；粗脂肪≥16%；保质期 18 个月'
                }, {
                    id: 2, orderId: 1, productId: 3, productName: '豆栗豆腐猫砂 6L 除臭低尘',
                    productImage: 'images/litter.jpg', price: 29.9, quantity: 2,
                    specs: '净含量 6L / 袋；颗粒直径 2mm；建议每月更换 2~3 袋'
                }]
            }],
            boarding: [{
                id: 1, orderNo: 'JY202611160001', userId: 2, packageId: 1,
                packageName: '猫咪舒适单间 · 标准房', price: 68, petName: '豆豆', petType: 'CAT',
                petBreed: '中华田园猫（橘）', petAge: '3 岁', petWeight: '4.8kg', vaccinated: true,
                startDate: '2026-11-22', endDate: '2026-11-25', days: 3, totalAmount: 204,
                contactName: '王豆栗', contactPhone: '13800000002',
                note: '豆豆有点怕生，麻烦多陪它玩一会儿～', status: 'CONFIRMED',
                createdAt: '2026-11-18 15:16:59'
            }],
            favorites: {},
            seq: { user: 3, product: 100, review: 100, cart: 1, address: 2, order: 3, orderItem: 4, boarding: 2 }
        };
    }

    function LJR_load() {
        try {
            var raw = localStorage.getItem(LJR_STORE_KEY);
            if (raw) {
                var obj = JSON.parse(raw);
                if (obj && obj.version === 3 && obj.products && obj.products.length) { return obj; }
            }
        } catch (e) { /* 忽略损坏的本地数据，重新生成 */ }
        return LJR_init();
    }

    function LJR_save() {
        try { localStorage.setItem(LJR_STORE_KEY, JSON.stringify(LJR_DB)); } catch (e) { /* 隐私模式可能写不进去 */ }
    }

    LJR_DB = LJR_load();

    /* ---------------- 登录态 ---------------- */
    function LJR_user(headers) {
        var auth = (headers && (headers.authorization || headers.Authorization)) || '';
        var m = /^Bearer\s+mock\.(\d+)\./i.exec(auth);
        if (!m) { return null; }
        var id = Number(m[1]);
        for (var i = 0; i < LJR_DB.users.length; i++) {
            if (LJR_DB.users[i].id === id && LJR_DB.users[i].status === 1) { return LJR_DB.users[i]; }
        }
        return null;
    }

    function LJR_publicUser(u) {
        if (!u) { return null; }
        var copy = {};
        for (var k in u) { if (k !== 'password') { copy[k] = u[k]; } }
        return copy;
    }

    function LJR_token(u) { return 'mock.' + u.id + '.' + Date.now(); }

    /* ---------------- 查询帮助 ---------------- */
    function LJR_product(id) {
        for (var i = 0; i < LJR_DB.products.length; i++) {
            if (String(LJR_DB.products[i].id) === String(id)) { return LJR_DB.products[i]; }
        }
        return null;
    }

    function LJR_category(id) {
        for (var i = 0; i < LJR_DB.categories.length; i++) {
            if (String(LJR_DB.categories[i].id) === String(id)) { return LJR_DB.categories[i]; }
        }
        return null;
    }

    function LJR_package(id) {
        for (var i = 0; i < LJR_DB.packages.length; i++) {
            if (String(LJR_DB.packages[i].id) === String(id)) { return LJR_DB.packages[i]; }
        }
        return null;
    }

    function LJR_rankedProducts(list, sort) {
        var arr = list.slice();
        if (sort === 'sales') {
            arr.sort(function (a, b) { return (b.sales || 0) - (a.sales || 0); });
        } else if (sort === 'price_asc') {
            arr.sort(function (a, b) { return Number(a.price) - Number(b.price); });
        } else if (sort === 'price_desc') {
            arr.sort(function (a, b) { return Number(b.price) - Number(a.price); });
        } else if (sort === 'new') {
            arr.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
        } else {
            arr.sort(function (a, b) { return (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || (b.sales || 0) - (a.sales || 0); });
        }
        return arr;
    }

    function LJR_page(list, query) {
        var page = Math.max(1, Number(query.page) || 1);
        var size = Math.max(1, Number(query.size) || 9);
        var total = list.length;
        var pages = Math.max(1, Math.ceil(total / size));
        return {
            list: list.slice((page - 1) * size, page * size),
            total: total, page: page, size: size, pages: pages
        };
    }

    function LJR_reviewsOf(productId) {
        return LJR_DB.reviews.filter(function (r) { return String(r.productId) === String(productId); })
            .sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
    }

    function LJR_relatedOf(product) {
        return LJR_DB.products.filter(function (p) {
            return p.status === 1 && p.id !== product.id && p.categoryId === product.categoryId;
        }).slice(0, 4);
    }

    function LJR_isFavorite(user, productId) {
        if (!user) { return false; }
        var ids = LJR_DB.favorites[user.id] || [];
        return ids.some(function (id) { return String(id) === String(productId); });
    }

    function LJR_cartOf(userId) { return LJR_DB.carts[userId] || []; }

    /* ---------------- 购物车 ---------------- */
    function LJR_cartView(item) {
        var p = LJR_product(item.productId);
        var valid = !!(p && p.status === 1);
        var stock = p ? p.stock : 0;
        var price = p ? Number(p.price) : Number(item.price || 0);
        return {
            id: item.id,
            productId: item.productId,
            name: p ? p.name : item.name,
            image: p ? p.image : item.image,
            specs: p ? p.specs : (item.specs || ''),
            price: price,
            quantity: item.quantity,
            checked: valid ? !!item.checked : false,
            stock: stock,
            valid: valid && stock > 0,
            subtotal: LJR_money(price * item.quantity)
        };
    }

    function LJR_cartCount(userId) {
        return LJR_cartOf(userId).reduce(function (sum, it) {
            var p = LJR_product(it.productId);
            return sum + (p && p.status === 1 ? it.quantity : 0);
        }, 0);
    }

    /* ---------------- 订单 ---------------- */
    function LJR_orderNo(prefix) {
        var d = new Date();
        return prefix + d.getFullYear() + LJR_pad(d.getMonth() + 1) + LJR_pad(d.getDate()) +
            LJR_pad(d.getHours()) + LJR_pad(d.getMinutes()) + LJR_pad(d.getSeconds()) +
            String(Math.floor(Math.random() * 9000) + 1000);
    }

    function LJR_ordersOf(user, query) {
        var list = LJR_DB.orders.filter(function (row) {
            return String(row.order.userId) === String(user.id);
        });
        if (query.status) {
            list = list.filter(function (row) { return row.order.status === query.status; });
        }
        list.sort(function (a, b) { return b.order.id - a.order.id; });
        return LJR_page(list, query);
    }

    function LJR_stats() {
        var paidStatus = { PAID: 1, SHIPPED: 1, COMPLETED: 1 };
        var days = [];
        var amounts = [];
        for (var i = 6; i >= 0; i--) {
            var label = LJR_day(-i);
            days.push(label);
            var sum = 0;
            LJR_DB.orders.forEach(function (row) {
                var o = row.order;
                if (!paidStatus[o.status]) { return; }
                var created = String(o.createdAt || '').slice(5, 10);
                if (created === label) { sum += Number(o.payAmount || 0); }
            });
            amounts.push(LJR_money(sum));
        }
        var salesAmount = 0;
        LJR_DB.orders.forEach(function (row) {
            if (paidStatus[row.order.status]) { salesAmount += Number(row.order.payAmount || 0); }
        });
        var recent = LJR_DB.orders.slice().sort(function (a, b) { return b.order.id - a.order.id; }).slice(0, 5);
        var hot = LJR_DB.products.slice().sort(function (a, b) { return (b.sales || 0) - (a.sales || 0); }).slice(0, 6);
        return {
            trendDays: days,
            trendAmounts: amounts,
            pendingBoarding: LJR_DB.boarding.filter(function (b) { return b.status === 'PENDING'; }).length,
            userCount: LJR_DB.users.length,
            boardingCount: LJR_DB.boarding.length,
            salesAmount: LJR_money(salesAmount),
            orderCount: LJR_DB.orders.length,
            pendingShip: LJR_DB.orders.filter(function (row) { return row.order.status === 'PAID'; }).length,
            productCount: LJR_DB.products.length,
            hotProducts: hot,
            recentOrders: recent
        };
    }

    /* ---------------- 路由分发 ---------------- */
    function LJR_handle(method, rawUrl, body, headers) {
        var url = String(rawUrl || '');
        var path = url;
        var query = {};
        try {
            var parsed = new URL(url, location.href);
            path = parsed.pathname.replace(/^\/api/, '');
            parsed.searchParams.forEach(function (v, k) { query[k] = v; });
        } catch (e) {
            var q = url.split('?')[1];
            path = url.split('?')[0].replace(/^\/api/, '');
            if (q) {
                q.split('&').forEach(function (kv) {
                    var pair = kv.split('=');
                    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
                });
            }
        }
        var data = {};
        if (body) {
            try { data = typeof body === 'string' ? JSON.parse(body) : body; } catch (e) { data = {}; }
        }
        var seg = path.split('/').filter(Boolean);
        var user = LJR_user(headers);
        var i, item;

        /* ---- 认证 ---- */
        if (path === '/auth/login' && method === 'POST') {
            var loginName = String(data.username || '').trim();
            var loginUser = null;
            for (i = 0; i < LJR_DB.users.length; i++) {
                if (LJR_DB.users[i].username === loginName) { loginUser = LJR_DB.users[i]; }
            }
            if (!loginUser || loginUser.password !== String(data.password || '')) {
                return LJR_fail('账号或密码不正确');
            }
            if (loginUser.status !== 1) { return LJR_fail('账号已被停用，请联系店长'); }
            return LJR_ok({ token: LJR_token(loginUser), user: LJR_publicUser(loginUser) }, '登录成功');
        }

        if (path === '/auth/register' && method === 'POST') {
            var uname = String(data.username || '').trim();
            if (uname.length < 3) { return LJR_fail('账号至少 3 位'); }
            if (String(data.password || '').length < 6) { return LJR_fail('密码至少 6 位'); }
            for (i = 0; i < LJR_DB.users.length; i++) {
                if (LJR_DB.users[i].username === uname) { return LJR_fail('账号已存在，换一个试试'); }
            }
            var newUser = {
                id: LJR_DB.seq.user++, username: uname, password: String(data.password),
                nickname: data.nickname || uname, phone: data.phone || '', email: data.email || '',
                avatar: null, role: 'USER', status: 1, bio: null, createdAt: LJR_now()
            };
            LJR_DB.users.push(newUser);
            LJR_save();
            return LJR_ok({ token: LJR_token(newUser), user: LJR_publicUser(newUser) }, '注册成功');
        }

        if (path === '/auth/me' && method === 'GET') {
            return LJR_ok(LJR_publicUser(user));
        }

        if (path === '/auth/profile' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            ['nickname', 'phone', 'email', 'avatar', 'bio'].forEach(function (k) {
                if (data[k] !== undefined) { user[k] = data[k]; }
            });
            LJR_save();
            return LJR_ok(LJR_publicUser(user), '资料已更新');
        }

        if (path === '/auth/password' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            if (user.password !== String(data.oldPassword || '')) { return LJR_fail('原密码不正确'); }
            user.password = String(data.newPassword || '');
            LJR_save();
            return LJR_ok(true, '密码已修改');
        }

        /* ---- 商品与分类（公开） ---- */
        if (path === '/products' && method === 'GET') {
            var shopList = LJR_DB.products.filter(function (p) { return p.status === 1; });
            if (query.keyword) {
                var kw = String(query.keyword).toLowerCase();
                shopList = shopList.filter(function (p) {
                    return String(p.name || '').toLowerCase().indexOf(kw) >= 0 ||
                        String(p.subtitle || '').toLowerCase().indexOf(kw) >= 0 ||
                        String(p.tags || '').toLowerCase().indexOf(kw) >= 0;
                });
            }
            if (query.categoryId) {
                shopList = shopList.filter(function (p) { return String(p.categoryId) === String(query.categoryId); });
            }
            if (query.petType) {
                shopList = shopList.filter(function (p) { return p.petType === query.petType || p.petType === 'ALL'; });
            }
            if (query.minPrice) {
                shopList = shopList.filter(function (p) { return Number(p.price) >= Number(query.minPrice); });
            }
            if (query.maxPrice) {
                shopList = shopList.filter(function (p) { return Number(p.price) <= Number(query.maxPrice); });
            }
            return LJR_ok(LJR_page(LJR_rankedProducts(shopList, query.sort), query));
        }

        if (path === '/products/hot' && method === 'GET') {
            return LJR_ok(LJR_DB.products.filter(function (p) { return p.status === 1 && p.hot; }).slice(0, 8));
        }

        if (path === '/products/new' && method === 'GET') {
            return LJR_ok(LJR_rankedProducts(LJR_DB.products.filter(function (p) { return p.status === 1; }), 'new').slice(0, 8));
        }

        if (path === '/products/recommend' && method === 'GET') {
            return LJR_ok(LJR_rankedProducts(LJR_DB.products.filter(function (p) { return p.status === 1; }), 'sales').slice(0, 8));
        }

        if (path === '/products/favorites/mine' && method === 'GET') {
            if (!user) { return LJR_ok([]); }
            var favIds = LJR_DB.favorites[user.id] || [];
            return LJR_ok(LJR_DB.products.filter(function (p) {
                return favIds.some(function (id) { return String(id) === String(p.id); });
            }));
        }

        if (seg[0] === 'products' && seg[2] === 'reviews' && method === 'POST') {
            if (!user) { return LJR_fail('请先登录'); }
            var rProduct = LJR_product(seg[1]);
            if (!rProduct) { return LJR_fail('商品不存在'); }
            var review = {
                id: LJR_DB.seq.review++, userId: user.id, productId: rProduct.id,
                nickname: user.nickname || user.username, avatar: user.avatar,
                rating: Number(data.rating) || 5, content: String(data.content || ''), createdAt: LJR_now()
            };
            LJR_DB.reviews.push(review);
            var own = LJR_DB.reviews.filter(function (r) { return String(r.productId) === String(rProduct.id); });
            rProduct.reviewCount = own.length;
            rProduct.rating = LJR_money(own.reduce(function (s, r) { return s + Number(r.rating || 0); }, 0) / own.length);
            LJR_save();
            return LJR_ok(review, '评价已发布');
        }

        if (seg[0] === 'products' && seg[2] === 'favorite' && method === 'POST') {
            if (!user) { return LJR_fail('请先登录'); }
            var fId = seg[1];
            var ids = LJR_DB.favorites[user.id] || (LJR_DB.favorites[user.id] = []);
            var at = -1;
            for (i = 0; i < ids.length; i++) { if (String(ids[i]) === String(fId)) { at = i; } }
            if (at >= 0) { ids.splice(at, 1); } else { ids.push(Number(fId)); }
            LJR_save();
            return LJR_ok(at < 0, at < 0 ? '已加入收藏' : '已取消收藏');
        }

        if (seg[0] === 'products' && seg.length === 2 && method === 'GET') {
            var detail = LJR_product(seg[1]);
            if (!detail) { return LJR_fail('商品不存在'); }
            return LJR_ok({
                product: detail,
                reviews: LJR_reviewsOf(detail.id),
                related: LJR_relatedOf(detail),
                favorite: LJR_isFavorite(user, detail.id)
            });
        }

        if (path === '/categories' && method === 'GET') {
            return LJR_ok(LJR_DB.categories.slice().sort(function (a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); }));
        }

        /* ---- 购物车 ---- */
        if (path === '/cart' && method === 'GET') {
            if (!user) { return LJR_ok([]); }
            return LJR_ok(LJR_cartOf(user.id).map(LJR_cartView));
        }

        if (path === '/cart/count' && method === 'GET') {
            return LJR_ok(user ? LJR_cartCount(user.id) : 0);
        }

        if (path === '/cart' && method === 'POST') {
            if (!user) { return LJR_fail('请先登录'); }
            var cp = LJR_product(data.productId);
            if (!cp || cp.status !== 1) { return LJR_fail('商品已下架'); }
            var qty = Math.max(1, Number(data.quantity) || 1);
            var cart = LJR_DB.carts[user.id] || (LJR_DB.carts[user.id] = []);
            var exist = null;
            for (i = 0; i < cart.length; i++) { if (String(cart[i].productId) === String(cp.id)) { exist = cart[i]; } }
            if (exist) {
                exist.quantity = Math.min(cp.stock, exist.quantity + qty);
            } else {
                cart.push({
                    id: LJR_DB.seq.cart++, productId: cp.id, name: cp.name, image: cp.image,
                    specs: cp.specs, price: cp.price, quantity: Math.min(cp.stock, qty), checked: true
                });
            }
            LJR_save();
            return LJR_ok(LJR_cartOf(user.id).map(LJR_cartView), '已加入购物车');
        }

        if (path === '/cart/check-all' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            var checked = String(query.checked) === 'true';
            LJR_cartOf(user.id).forEach(function (it) { it.checked = checked; });
            LJR_save();
            return LJR_ok(true);
        }

        if (seg[0] === 'cart' && seg.length === 2 && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            var edit = null;
            LJR_cartOf(user.id).forEach(function (it) { if (String(it.id) === String(seg[1])) { edit = it; } });
            if (!edit) { return LJR_fail('购物车项不存在'); }
            if (query.quantity !== undefined) {
                var pEdit = LJR_product(edit.productId);
                edit.quantity = Math.max(1, Math.min(pEdit ? pEdit.stock : 999, Number(query.quantity) || 1));
            }
            if (query.checked !== undefined) { edit.checked = String(query.checked) === 'true'; }
            LJR_save();
            return LJR_ok(true);
        }

        if (seg[0] === 'cart' && seg.length === 2 && method === 'DELETE') {
            if (!user) { return LJR_fail('请先登录'); }
            LJR_DB.carts[user.id] = LJR_cartOf(user.id).filter(function (it) { return String(it.id) !== String(seg[1]); });
            LJR_save();
            return LJR_ok(true, '已移除');
        }

        if (path === '/cart' && method === 'DELETE') {
            if (!user) { return LJR_fail('请先登录'); }
            LJR_DB.carts[user.id] = [];
            LJR_save();
            return LJR_ok(true, '购物车已清空');
        }

        /* ---- 地址 ---- */
        if (path === '/addresses' && method === 'GET') {
            return LJR_ok(user ? (LJR_DB.addresses[user.id] || []) : []);
        }

        if (path === '/addresses' && method === 'POST') {
            if (!user) { return LJR_fail('请先登录'); }
            var list = LJR_DB.addresses[user.id] || (LJR_DB.addresses[user.id] = []);
            var addr = null;
            if (data.id) {
                for (i = 0; i < list.length; i++) { if (String(list[i].id) === String(data.id)) { addr = list[i]; } }
            }
            if (addr) {
                ['receiver', 'phone', 'province', 'city', 'district', 'detail', 'isDefault'].forEach(function (k) {
                    if (data[k] !== undefined) { addr[k] = data[k]; }
                });
            } else {
                addr = {
                    id: LJR_DB.seq.address++, userId: user.id, receiver: data.receiver, phone: data.phone,
                    province: data.province || '', city: data.city || '', district: data.district || '',
                    detail: data.detail, isDefault: list.length === 0 ? true : !!data.isDefault
                };
                list.push(addr);
            }
            if (addr.isDefault) {
                list.forEach(function (a) { if (a.id !== addr.id) { a.isDefault = false; } });
            }
            LJR_save();
            return LJR_ok(addr, '地址已保存');
        }

        if (seg[0] === 'addresses' && seg[2] === 'default' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            (LJR_DB.addresses[user.id] || []).forEach(function (a) {
                a.isDefault = String(a.id) === String(seg[1]);
            });
            LJR_save();
            return LJR_ok(true, '已设为默认地址');
        }

        if (seg[0] === 'addresses' && seg.length === 2 && method === 'DELETE') {
            if (!user) { return LJR_fail('请先登录'); }
            var remain = (LJR_DB.addresses[user.id] || []).filter(function (a) { return String(a.id) !== String(seg[1]); });
            if (remain.length && !remain.some(function (a) { return a.isDefault; })) { remain[0].isDefault = true; }
            LJR_DB.addresses[user.id] = remain;
            LJR_save();
            return LJR_ok(true, '地址已删除');
        }

        /* ---- 订单 ---- */
        if (path === '/orders' && method === 'POST') {
            if (!user) { return LJR_fail('请先登录'); }
            var address = null;
            (LJR_DB.addresses[user.id] || []).forEach(function (a) {
                if (String(a.id) === String(data.addressId)) { address = a; }
            });
            if (!address) { return LJR_fail('请选择收货地址'); }
            var lines = [];
            var total = 0;
            (data.items || []).forEach(function (line) {
                var pr = LJR_product(line.productId);
                if (!pr || pr.status !== 1) { return; }
                var n = Math.max(1, Number(line.quantity) || 1);
                total += Number(pr.price) * n;
                lines.push({
                    id: LJR_DB.seq.orderItem++, orderId: 0, productId: pr.id, productName: pr.name,
                    productImage: pr.image, price: Number(pr.price), quantity: n, specs: pr.specs
                });
            });
            if (!lines.length) { return LJR_fail('没有可结算的商品'); }
            total = LJR_money(total);
            var freight = total >= 99 ? 0 : 8;
            var discount = total >= 199 ? 15 : 0;
            var orderId = LJR_DB.seq.order++;
            lines.forEach(function (line) { line.orderId = orderId; });
            var order = {
                id: orderId, orderNo: LJR_orderNo('DL'), userId: user.id, totalAmount: total,
                freight: freight, payAmount: LJR_money(Math.max(0, total + freight - discount)),
                status: 'PENDING_PAYMENT',
                receiverName: address.receiver, receiverPhone: address.phone,
                receiverAddress: address.province + address.city + address.district + address.detail,
                remark: data.remark || null, logisticsNo: null, createdAt: LJR_now(),
                payTime: null, shipTime: null, finishTime: null
            };
            LJR_DB.orders.push({ order: order, items: lines });
            lines.forEach(function (line) {
                var pr = LJR_product(line.productId);
                if (pr) {
                    pr.stock = Math.max(0, pr.stock - line.quantity);
                    pr.sales = (pr.sales || 0) + line.quantity;
                }
            });
            if (data.fromCart) {
                var bought = lines.map(function (l) { return String(l.productId); });
                LJR_DB.carts[user.id] = LJR_cartOf(user.id).filter(function (it) {
                    return bought.indexOf(String(it.productId)) < 0;
                });
            }
            LJR_save();
            return LJR_ok({ order: order, items: lines }, '订单已提交');
        }

        if (path === '/orders' && method === 'GET') {
            if (!user) { return LJR_ok({ list: [], total: 0, page: 1, size: 10, pages: 1 }); }
            return LJR_ok(LJR_ordersOf(user, query));
        }

        if (seg[0] === 'orders' && seg.length === 2 && method === 'GET') {
            if (!user) { return LJR_fail('请先登录'); }
            var row = null;
            LJR_DB.orders.forEach(function (r) {
                if (String(r.order.id) === String(seg[1]) && String(r.order.userId) === String(user.id)) { row = r; }
            });
            if (!row) { return LJR_fail('订单不存在'); }
            return LJR_ok({ order: row.order, items: row.items });
        }

        if (seg[0] === 'orders' && seg[2] === 'pay' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            var payRow = null;
            LJR_DB.orders.forEach(function (r) { if (String(r.order.id) === String(seg[1])) { payRow = r; } });
            if (!payRow) { return LJR_fail('订单不存在'); }
            payRow.order.status = 'PAID';
            payRow.order.payTime = LJR_now();
            LJR_save();
            return LJR_ok(payRow.order, '支付成功');
        }

        if (seg[0] === 'orders' && seg[2] === 'cancel' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            var cancelRow = null;
            LJR_DB.orders.forEach(function (r) { if (String(r.order.id) === String(seg[1])) { cancelRow = r; } });
            if (!cancelRow) { return LJR_fail('订单不存在'); }
            cancelRow.order.status = 'CANCELLED';
            cancelRow.items.forEach(function (line) {
                var pr = LJR_product(line.productId);
                if (pr) { pr.stock += line.quantity; pr.sales = Math.max(0, (pr.sales || 0) - line.quantity); }
            });
            LJR_save();
            return LJR_ok(true, '订单已取消');
        }

        if (seg[0] === 'orders' && seg[2] === 'confirm' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            var okRow = null;
            LJR_DB.orders.forEach(function (r) { if (String(r.order.id) === String(seg[1])) { okRow = r; } });
            if (!okRow) { return LJR_fail('订单不存在'); }
            okRow.order.status = 'COMPLETED';
            okRow.order.finishTime = LJR_now();
            LJR_save();
            return LJR_ok(true, '已确认收货');
        }

        /* ---- 寄养 ---- */
        if (path === '/boarding/packages' && method === 'GET') {
            return LJR_ok(LJR_DB.packages.filter(function (p) { return p.status === 1; }));
        }

        if (seg[0] === 'boarding' && seg[1] === 'packages' && seg.length === 3 && method === 'GET') {
            var pk = LJR_package(seg[2]);
            return pk ? LJR_ok(pk) : LJR_fail('套餐不存在');
        }

        if (path === '/boarding/orders' && method === 'POST') {
            if (!user) { return LJR_fail('请先登录'); }
            var pack = LJR_package(data.packageId);
            if (!pack) { return LJR_fail('请选择寄养房型'); }
            var start = LJR_date(data.startDate);
            var end = LJR_date(data.endDate);
            var days = Math.round((new Date(end) - new Date(start)) / 86400000);
            if (!(days > 0)) { return LJR_fail('接回日期需要晚于入住日期'); }
            var boarding = {
                id: LJR_DB.seq.boarding++, orderNo: LJR_orderNo('JY'), userId: user.id,
                packageId: pack.id, packageName: pack.name, price: Number(pack.price),
                petName: data.petName || '', petType: data.petType || 'CAT', petBreed: data.petBreed || '',
                petAge: data.petAge || '', petWeight: data.petWeight || '', vaccinated: !!data.vaccinated,
                startDate: start, endDate: end, days: days,
                totalAmount: LJR_money(Number(pack.price) * days),
                contactName: data.contactName || '', contactPhone: data.contactPhone || '',
                note: data.note || '', status: 'PENDING', createdAt: LJR_now()
            };
            LJR_DB.boarding.push(boarding);
            LJR_save();
            return LJR_ok({ orderNo: boarding.orderNo, order: boarding }, '预约成功');
        }

        if (path === '/boarding/orders' && method === 'GET') {
            if (!user) { return LJR_ok([]); }
            return LJR_ok(LJR_DB.boarding.filter(function (b) {
                return String(b.userId) === String(user.id);
            }).sort(function (a, b) { return b.id - a.id; }));
        }

        if (seg[0] === 'boarding' && seg[1] === 'orders' && seg.length === 3 && method === 'GET') {
            if (!user) { return LJR_fail('请先登录'); }
            var found = null;
            LJR_DB.boarding.forEach(function (b) { if (String(b.id) === String(seg[2])) { found = b; } });
            return found ? LJR_ok(found) : LJR_fail('寄养单不存在');
        }

        if (seg[0] === 'boarding' && seg[1] === 'orders' && seg[3] === 'cancel' && method === 'PUT') {
            if (!user) { return LJR_fail('请先登录'); }
            var cancelB = null;
            LJR_DB.boarding.forEach(function (b) { if (String(b.id) === String(seg[2])) { cancelB = b; } });
            if (!cancelB) { return LJR_fail('寄养单不存在'); }
            cancelB.status = 'CANCELLED';
            LJR_save();
            return LJR_ok(true, '预约已取消');
        }

        /* ---- 后台 ---- */
        if (path === '/admin/stats' && method === 'GET') {
            return LJR_ok(LJR_stats());
        }

        if (path === '/admin/products' && method === 'GET') {
            var allProducts = LJR_DB.products.slice().sort(function (a, b) { return b.id - a.id; });
            return LJR_ok(LJR_page(allProducts, query));
        }

        if (path === '/admin/products' && method === 'POST') {
            var created = LJR_clone(data);
            created.id = LJR_DB.seq.product++;
            created.image = created.image || 'images/cat-food.jpg';
            created.detailImages = created.detailImages || created.image;
            created.sales = created.sales || 0;
            created.rating = created.rating || 5;
            created.reviewCount = 0;
            created.createdAt = LJR_now();
            LJR_DB.products.push(created);
            LJR_save();
            return LJR_ok(created, '商品已新增');
        }

        if (path === '/admin/products' && method === 'PUT') {
            var target = LJR_product(data.id);
            if (!target) { return LJR_fail('商品不存在'); }
            for (var pk2 in data) { if (data.hasOwnProperty(pk2)) { target[pk2] = data[pk2]; } }
            LJR_save();
            return LJR_ok(target, '商品已保存');
        }

        if (seg[0] === 'admin' && seg[1] === 'products' && seg.length === 3 && method === 'DELETE') {
            var del = LJR_product(seg[2]);
            if (del) { del.status = 0; }
            LJR_save();
            return LJR_ok(true, '商品已下架');
        }

        if (path === '/admin/orders' && method === 'GET') {
            var adminOrders = LJR_DB.orders.slice().sort(function (a, b) { return b.order.id - a.order.id; });
            if (query.status) {
                adminOrders = adminOrders.filter(function (r) { return r.order.status === query.status; });
            }
            return LJR_ok(adminOrders);
        }

        if (seg[0] === 'admin' && seg[1] === 'orders' && seg[3] === 'ship' && method === 'PUT') {
            var shipRow = null;
            LJR_DB.orders.forEach(function (r) { if (String(r.order.id) === String(seg[2])) { shipRow = r; } });
            if (!shipRow) { return LJR_fail('订单不存在'); }
            shipRow.order.status = 'SHIPPED';
            shipRow.order.shipTime = LJR_now();
            shipRow.order.logisticsNo = query.logisticsNo || ('SF' + Date.now().toString().slice(-10));
            LJR_save();
            return LJR_ok(shipRow.order, '已发货');
        }

        if (path === '/admin/boarding-orders' && method === 'GET') {
            return LJR_ok(LJR_DB.boarding.slice().sort(function (a, b) { return b.id - a.id; }));
        }

        if (seg[0] === 'admin' && seg[1] === 'boarding-orders' && seg[3] === 'status' && method === 'PUT') {
            var statusB = null;
            LJR_DB.boarding.forEach(function (b) { if (String(b.id) === String(seg[2])) { statusB = b; } });
            if (!statusB) { return LJR_fail('寄养单不存在'); }
            statusB.status = query.status || statusB.status;
            LJR_save();
            return LJR_ok(statusB, '状态已更新');
        }

        if (path === '/admin/users' && method === 'GET') {
            return LJR_ok(LJR_DB.users.slice().sort(function (a, b) { return b.id - a.id; }).map(LJR_publicUser));
        }

        if (seg[0] === 'admin' && seg[1] === 'users' && seg[3] === 'toggle' && method === 'PUT') {
            var toggleUser = null;
            LJR_DB.users.forEach(function (u) { if (String(u.id) === String(seg[2])) { toggleUser = u; } });
            if (!toggleUser) { return LJR_fail('用户不存在'); }
            toggleUser.status = toggleUser.status === 1 ? 0 : 1;
            LJR_save();
            return LJR_ok(LJR_publicUser(toggleUser), toggleUser.status === 1 ? '账号已启用' : '账号已停用');
        }

        if (path === '/admin/boarding-packages' && method === 'GET') {
            return LJR_ok(LJR_DB.packages);
        }

        if (path === '/admin/boarding-packages' && method === 'POST') {
            var newPack = LJR_clone(data);
            newPack.id = Math.max.apply(null, LJR_DB.packages.map(function (p) { return p.id; }).concat([0])) + 1;
            newPack.rating = newPack.rating || 4.9;
            newPack.status = newPack.status === undefined ? 1 : newPack.status;
            newPack.cover = newPack.cover || 'images/boarding-cat.jpg';
            LJR_DB.packages.push(newPack);
            LJR_save();
            return LJR_ok(newPack, '套餐已新增');
        }

        if (path === '/admin/boarding-packages' && method === 'PUT') {
            var editPack = LJR_package(data.id);
            if (!editPack) { return LJR_fail('套餐不存在'); }
            for (var key in data) { if (data.hasOwnProperty(key)) { editPack[key] = data[key]; } }
            LJR_save();
            return LJR_ok(editPack, '套餐已保存');
        }

        if (seg[0] === 'admin' && seg[1] === 'boarding-packages' && seg[3] === 'toggle' && method === 'PUT') {
            var togglePack = LJR_package(seg[2]);
            if (!togglePack) { return LJR_fail('套餐不存在'); }
            togglePack.status = togglePack.status === 1 ? 0 : 1;
            LJR_save();
            return LJR_ok(togglePack, togglePack.status === 1 ? '套餐已上架' : '套餐已停售');
        }

        if (path === '/admin/reviews' && method === 'GET') {
            var rows = LJR_DB.reviews.slice().sort(function (a, b) { return b.id - a.id; }).map(function (r) {
                var pr = LJR_product(r.productId);
                return { review: r, productName: pr ? pr.name : '' };
            });
            return LJR_ok(rows);
        }

        /* ---- 图片上传（演示环境直接回显一张本地图） ---- */
        if (path === '/upload' && method === 'POST') {
            return LJR_ok({ url: 'images/cat-food.jpg' }, '上传成功');
        }

        return LJR_fail('接口不存在：' + method + ' ' + path);
    }

    /* ---------------- 请求拦截 ---------------- */
    var LJR_RealXHR = window.XMLHttpRequest;

    function LJR_isApi(url) {
        try {
            return new URL(url, location.href).pathname.indexOf('/api/') === 0;
        } catch (e) {
            return String(url).indexOf('/api/') === 0;
        }
    }

    function LJR_FakeXHR() {
        this.readyState = 0;
        this.status = 0;
        this.statusText = '';
        this.response = '';
        this.responseText = '';
        this.responseType = '';
        this.responseURL = '';
        this.timeout = 0;
        this.withCredentials = false;
        this.upload = { addEventListener: function () { }, removeEventListener: function () { } };
        this.onreadystatechange = null;
        this.onload = null;
        this.onloadend = null;
        this.onloadstart = null;
        this.onprogress = null;
        this.onerror = null;
        this.ontimeout = null;
        this.onabort = null;
        this.__headers = {};
        this.__listeners = {};
        this.__method = 'GET';
        this.__url = '';
        this.__aborted = false;
    }

    LJR_FakeXHR.prototype.open = function (method, url) {
        this.__method = String(method || 'GET').toUpperCase();
        this.__url = String(url || '');
        this.readyState = 1;
        this.__emit('readystatechange');
    };

    LJR_FakeXHR.prototype.setRequestHeader = function (k, v) {
        this.__headers[String(k).toLowerCase()] = String(v);
    };

    LJR_FakeXHR.prototype.getResponseHeader = function (k) {
        return String(k).toLowerCase() === 'content-type' ? 'application/json;charset=utf-8' : null;
    };

    LJR_FakeXHR.prototype.getAllResponseHeaders = function () {
        return 'content-type: application/json;charset=utf-8\r\n';
    };

    LJR_FakeXHR.prototype.addEventListener = function (type, fn) {
        (this.__listeners[type] = this.__listeners[type] || []).push(fn);
    };

    LJR_FakeXHR.prototype.removeEventListener = function (type, fn) {
        var arr = this.__listeners[type] || [];
        var at = arr.indexOf(fn);
        if (at >= 0) { arr.splice(at, 1); }
    };

    LJR_FakeXHR.prototype.abort = function () {
        this.__aborted = true;
        this.__emit('abort');
        this.__emit('loadend');
    };

    LJR_FakeXHR.prototype.__emit = function (type) {
        if (this.__aborted && type !== 'abort' && type !== 'loadend') { return; }
        var event = { type: type, target: this, currentTarget: this };
        var handler = this['on' + type];
        if (typeof handler === 'function') { handler.call(this, event); }
        var arr = this.__listeners[type] || [];
        for (var i = 0; i < arr.length; i++) { arr[i].call(this, event); }
    };

    LJR_FakeXHR.prototype.send = function (body) {
        var self = this;

        // 非 /api 请求走真实 XHR（静态资源不会走这里，留作兜底）
        if (!LJR_isApi(this.__url)) {
            var real = new LJR_RealXHR();
            real.open(this.__method, this.__url, true);
            for (var h in this.__headers) {
                try { real.setRequestHeader(h, this.__headers[h]); } catch (e) { /* 忽略非法请求头 */ }
            }
            if (this.timeout) { real.timeout = this.timeout; }
            if (this.responseType) { real.responseType = this.responseType; }
            ['readystatechange', 'load', 'loadend', 'error', 'timeout', 'abort'].forEach(function (t) {
                real.addEventListener(t, function () {
                    self.readyState = real.readyState;
                    self.status = real.status;
                    self.statusText = real.statusText;
                    self.response = real.response;
                    self.responseText = real.responseText;
                    self.__emit(t);
                });
            });
            real.send(body || null);
            return;
        }

        var result = LJR_handle(this.__method, this.__url, body, this.__headers);
        setTimeout(function () {
            if (self.__aborted) { return; }
            var text = JSON.stringify(result.body);
            self.status = result.status;
            self.statusText = 'OK';
            self.responseText = text;
            self.response = self.responseType === 'json' ? result.body : text;
            self.responseURL = self.__url;
            self.readyState = 4;
            self.__emit('readystatechange');
            self.__emit('load');
            self.__emit('loadend');
        }, 60);
    };

    window.XMLHttpRequest = LJR_FakeXHR;

    // 兜底：若某处使用 fetch 请求 /api，同样返回 mock 数据
    if (window.fetch) {
        var LJR_realFetch = window.fetch.bind(window);
        window.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : (input && input.url);
            if (!LJR_isApi(url)) { return LJR_realFetch(input, init); }
            var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
            var headers = {};
            if (init && init.headers) {
                if (typeof init.headers.forEach === 'function' && !Array.isArray(init.headers)) {
                    init.headers.forEach(function (v, k) { headers[String(k).toLowerCase()] = v; });
                } else {
                    for (var k in init.headers) { headers[String(k).toLowerCase()] = init.headers[k]; }
                }
            }
            var result = LJR_handle(method, url, init && init.body, headers);
            return Promise.resolve(new Response(JSON.stringify(result.body), {
                status: 200,
                headers: { 'Content-Type': 'application/json;charset=utf-8' }
            }));
        };
    }

    // 供本地脚本测试接口逻辑
    window.LJR_mockHandle = LJR_handle;
    window.LJR_mockState = function () { return LJR_DB; };
    window.LJR_mockReset = function () {
        LJR_DB = LJR_init();
        LJR_save();
    };
})();
