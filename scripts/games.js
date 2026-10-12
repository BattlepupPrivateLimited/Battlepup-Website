(() => {
	const track = document.querySelector('.games');
	const nav   = document.querySelector('.games-nav');
	const prev  = document.getElementById('games-prev');
	const next  = document.getElementById('games-next');
	if (!track || !nav || !prev || !next) return;

	const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

	// distance of one card plus the gap between cards
	function step() {
		const card = track.querySelector('.game-card');
		if (!card) return track.clientWidth;
		const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
		return card.getBoundingClientRect().width + gap;
	}

	function go(direction) {
		track.scrollBy({ left: direction * step(), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
	}

	// show the arrows only when there is something to scroll
	function update() {
		const max = track.scrollWidth - track.clientWidth;
		nav.hidden = max <= 1;
		track.toggleAttribute('data-scrollable', max > 1);
		prev.setAttribute('aria-disabled', String(track.scrollLeft <= 1));
		next.setAttribute('aria-disabled', String(track.scrollLeft >= max - 1));
	}

	prev.addEventListener('click', () => go(-1));
	next.addEventListener('click', () => go(1));
	track.addEventListener('scroll', update, { passive: true });
	new ResizeObserver(update).observe(track);

	// mouse drag (touch screens already scroll natively)
	let dragging = false, moved = false, startX = 0, startLeft = 0;

	track.addEventListener('pointerdown', (e) => {
		if (e.pointerType !== 'mouse' || e.button !== 0) return;
		dragging = true;
		moved = false;
		startX = e.clientX;
		startLeft = track.scrollLeft;
	});

	track.addEventListener('pointermove', (e) => {
		if (!dragging) return;
		const dx = e.clientX - startX;
		if (!moved && Math.abs(dx) > 5) {
			moved = true;
			track.setPointerCapture(e.pointerId);
			track.classList.add('is-dragging');
			track.style.scrollSnapType = 'none'; // snapping fights the drag
		}
		if (moved) track.scrollLeft = startLeft - dx;
	});

	function endDrag() {
		if (!dragging) return;
		dragging = false;
		track.classList.remove('is-dragging');
		track.style.scrollSnapType = ''; // the row snaps to the nearest card again
	}
	track.addEventListener('pointerup', endDrag);
	track.addEventListener('pointercancel', endDrag);

	// a drag must not count as a click on a future card link
	track.addEventListener('click', (e) => {
		if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
	}, true);

	// mouse wheel: one notch moves one card (delete this block if you don't want it)
	let wheelLock = false;
	track.addEventListener('wheel', (e) => {
		if (nav.hidden || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
		e.preventDefault();
		if (wheelLock) return;
		wheelLock = true;
		setTimeout(() => { wheelLock = false; }, 450);
		go(Math.sign(e.deltaY));
	}, { passive: false });

	update();
})();