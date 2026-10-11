const allowedOrigin = 'https://christydun.github.io';
const hiscoresUrl = 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws';

function corsHeaders(origin) {
    const headers = new Headers({
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
    });

    if (origin === allowedOrigin) {
        headers.set('Access-Control-Allow-Origin', allowedOrigin);
        headers.set('Vary', 'Origin');
    }

    return headers;
}

export default {
    async fetch(request) {
        const origin = request.headers.get('Origin');
        const headers = corsHeaders(origin);

        if (request.method === 'OPTIONS') {
            if (origin !== allowedOrigin) {
                return new Response('Origin not allowed.', { status: 403, headers });
            }

            headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            headers.set('Access-Control-Max-Age', '86400');
            return new Response(null, { status: 204, headers });
        }

        if (request.method !== 'GET') {
            headers.set('Allow', 'GET, OPTIONS');
            return new Response('Method not allowed.', { status: 405, headers });
        }

        const player = new URL(request.url).searchParams.get('player')?.trim();
        if (!player || player.length > 12) {
            return new Response('A player name of 1 to 12 characters is required.', {
                status: 400,
                headers,
            });
        }

        const upstreamUrl = new URL(hiscoresUrl);
        upstreamUrl.searchParams.set('player', player);
        const upstreamResponse = await fetch(upstreamUrl);
        const body = await upstreamResponse.text();

        return new Response(body, {
            status: upstreamResponse.status,
            headers,
        });
    },
};
