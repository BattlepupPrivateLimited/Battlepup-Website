(() => {
	const carousel = document.querySelector('.carousel');
	if (!carousel) return;

	const slides  = [...carousel.querySelectorAll('.slide')];
	const markers = [...document.querySelectorAll('.slide-marker')];
	const prevBtn = document.getElementById('previous-btn');
	const nextBtn = document.getElementById('next-btn');
	const last    = slides.length - 1;
	let current   = 0;

	function goToSlide(index) {
		current = Math.min(Math.max(index, 0), last); // stops at the ends
		carousel.style.setProperty('--i', current);

		slides.forEach((slide, i) => {
			const on = i === current;
			slide.inert = !on; // off-screen slides can't be tabbed into
			slide.toggleAttribute('data-current', on);
		});

		markers.forEach((marker, i) => {
			marker.removeAttribute('active'); // legacy attribute from the HTML
			if (i === current) marker.setAttribute('aria-current', 'true');
			else marker.removeAttribute('aria-current');
		});

		prevBtn?.setAttribute('aria-disabled', String(current === 0));
		nextBtn?.setAttribute('aria-disabled', String(current === last));
	}

	// The HTML calls onclick="goToSlide(n)", so it must stay global.
	window.goToSlide = goToSlide;

	document.getElementById('carousel-nav')?.addEventListener('click', (e) => {
		const btn = e.target.closest('.nav-arrow-btn');
		if (btn) goToSlide(current + (btn.id === 'next-btn' ? 1 : -1));
	});

	document.addEventListener('keydown', (e) => {
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
		if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
		if (e.key === 'ArrowLeft')  goToSlide(current - 1);
		if (e.key === 'ArrowRight') goToSlide(current + 1);
	});

	let startX = 0, startY = 0;
	carousel.addEventListener('pointerdown', (e) => {
		startX = e.clientX;
		startY = e.clientY;
	});
	carousel.addEventListener('pointerup', (e) => {
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
			goToSlide(current + (dx < 0 ? 1 : -1));
		}
	});

	goToSlide(0);
})();