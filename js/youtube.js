// ── YouTube Auto-Update ──
const YT_KEY     = 'AIzaSyCCAydvAClrhaZJzCcAJekFUH4Y0ogWFR0';
const YT_CHANNEL = 'UChzYnfFd7El4XzbEPNnb9IQ';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getSeries(title) {
  const t = title.toLowerCase();
  if (t.includes('sunday')) return 'sunday';
  return 'special';
}

function getSeriesLabel(title) {
  const t = title.toLowerCase();
  if (t.includes('good friday'))  return 'Good Friday';
  if (t.includes('palm sunday'))  return 'Palm Sunday';
  if (t.includes('easter'))       return 'Easter Service';
  if (t.includes('christmas'))    return 'Christmas Service';
  if (t.includes('crossover') || t.includes('new year')) return 'New Year\'s Service';
  if (t.includes('sunday'))       return 'Sunday Service';
  return 'Special Service';
}

async function loadYouTubeVideos() {
  try {
    // playlistItems costs 1 quota unit vs 100 for search
    const uploadsPlaylist = YT_CHANNEL.replace(/^UC/, 'UU');
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=16&key=${YT_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.items || !data.items.length) return;

    const videos = data.items;
    const latest = videos[0];
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

    // ── Archive grid (sermons.html only) ──
    const grid = document.getElementById('sermonsGrid');
    if (!grid) return;

    grid.innerHTML = videos.map((v, i) => {
      const vid   = v.snippet.resourceId.videoId;
      const title = v.snippet.title;
      const date  = v.snippet.publishedAt;
      const thumb = v.snippet.thumbnails.high?.url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;

      return `
        <div class="sm-card" data-series="${getSeries(title)}">
          <div class="sm-thumb" style="background-image:url('${thumb}');">
            <a href="https://www.youtube.com/watch?v=${vid}" target="_blank" class="sm-play"><i class="fa-solid fa-play"></i></a>
            ${i === 0 ? '<span class="sm-badge">Latest</span>' : ''}
          </div>
          <div class="sm-info">
            <span class="sm-series">${getSeriesLabel(title)}</span>
            <h4>${title}</h4>
            <p>Rev. Alex Owusu Jnr. · ${fmtDate(date)}</p>
            <div class="sm-actions"><a href="https://www.youtube.com/watch?v=${vid}" target="_blank"><i class="fa-solid fa-play"></i> Watch</a></div>
          </div>
        </div>`;
    }).join('');

  } catch (err) {
    console.warn('YouTube feed unavailable.', err);
    const grid = document.getElementById('sermonsGrid');
    if (grid) grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--muted);">Could not load sermons. <a href="https://www.youtube.com/@TOPMinistriesNYC" target="_blank" style="color:var(--gold);">Watch on YouTube</a>.</p>`;
  }
}

loadYouTubeVideos();
