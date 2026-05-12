// ── YouTube Auto-Update (featured section only) ──
const YT_KEY     = 'AIzaSyCCAydvAClrhaZJzCcAJekFUH4Y0ogWFR0';
const YT_CHANNEL = 'UChzYnfFd7El4XzbEPNnb9IQ';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

async function loadYouTubeVideos() {
  try {
    const uploadsPlaylist = YT_CHANNEL.replace(/^UC/, 'UU');
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=1&key=${YT_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.error || !data.items || !data.items.length) return;

    const latest      = data.items[0];
    const latestId    = latest.snippet.resourceId.videoId;
    const latestTitle = latest.snippet.title;
    const latestDate  = latest.snippet.publishedAt;

    // ── Featured iframe (index.html & sermons.html) ──
    const iframe = document.querySelector('#featured-sermon iframe');
    if (iframe) {
      iframe.src   = `https://www.youtube.com/embed/${latestId}?rel=0`;
      iframe.title = latestTitle;
    }
    const featH2 = document.querySelector('#featured-sermon h2');
    if (featH2) featH2.textContent = latestTitle;

    const featMeta = document.querySelector('#featured-sermon .sermon-meta-line');
    if (featMeta) {
      featMeta.innerHTML = `<i class="fa-solid fa-user"></i> Rev. Alex Owusu Jnr. &nbsp;·&nbsp; <i class="fa-regular fa-calendar"></i> ${fmtDate(latestDate)}`;
    }

    // ── Also mark first card in static grid as Latest ──
    const firstCard = document.querySelector('#sermonsGrid .sm-card:first-child .sm-thumb');
    if (firstCard && !firstCard.querySelector('.sm-badge')) {
      const badge = document.createElement('span');
      badge.className = 'sm-badge';
      badge.textContent = 'Latest';
      firstCard.appendChild(badge);
    }

  } catch (err) {
    console.warn('YouTube feed unavailable.', err);
  }
}

loadYouTubeVideos();
