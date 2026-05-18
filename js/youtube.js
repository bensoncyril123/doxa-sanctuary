(async function () {
  const CHANNEL_ID = 'UChzYnfFd7El4XzbEPNnb9IQ';
  const FEED = encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=' + CHANNEL_ID);
  const API  = 'https://api.rss2json.com/v1/api.json?rss_url=' + FEED + '&count=12';

  function videoId(link) {
    const m = link.match(/[?&]v=([^&]+)/);
    return m ? m[1] : null;
  }

  function fmtDate(str) {
    return new Date(str).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  try {
    const res  = await fetch(API);
    const data = await res.json();
    if (!data.items || !data.items.length) return;

    const items  = data.items;
    const latest = items[0];
    const lid    = videoId(latest.link);

    // ── Featured section ──
    const iframe = document.querySelector('#featured-sermon iframe');
    if (iframe && lid) iframe.src = 'https://www.youtube.com/embed/' + lid + '?rel=0';

    const featH2 = document.querySelector('#featured-sermon h2');
    if (featH2) featH2.textContent = latest.title;

    const featMeta = document.querySelector('#featured-sermon .sermon-meta-line');
    if (featMeta) featMeta.innerHTML =
      '<i class="fa-solid fa-user"></i> Rev. Alex Owusu Jnr. &nbsp;·&nbsp; ' +
      '<i class="fa-regular fa-calendar"></i> ' + fmtDate(latest.pubDate);

    // ── Rebuild archive grid ──
    const grid = document.getElementById('sermonsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    items.forEach(function (item, i) {
      const id = videoId(item.link);
      if (!id) return;

      const card = document.createElement('div');
      card.className   = 'sm-card';
      card.dataset.series = 'sunday';

      card.innerHTML =
        '<div class="sm-thumb" style="background-image:url(\'https://img.youtube.com/vi/' + id + '/hqdefault.jpg\');">' +
          '<a href="' + item.link + '" target="_blank" class="sm-play"><i class="fa-solid fa-play"></i></a>' +
          (i === 0 ? '<span class="sm-badge">Latest</span>' : '') +
        '</div>' +
        '<div class="sm-info">' +
          '<span class="sm-series">TOP Ministries NYC</span>' +
          '<h4>' + item.title + '</h4>' +
          '<p>Rev. Alex Owusu Jnr. · ' + fmtDate(item.pubDate) + '</p>' +
          '<div class="sm-actions"><a href="' + item.link + '" target="_blank"><i class="fa-solid fa-play"></i> Watch</a></div>' +
        '</div>';

      grid.appendChild(card);
    });

    // Re-run card animations
    document.querySelectorAll('.sm-card').forEach(function (card, i) {
      setTimeout(function () { card.classList.add('visible'); }, i * 150);
    });

  } catch (err) {
    console.warn('YouTube feed unavailable — showing static fallback.', err);
  }
})();
