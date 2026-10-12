(() => {
	const toc = document.querySelector('.toc');
	const doc = document.querySelector('.doc');
	if (!toc || !doc) return;

	const small = matchMedia('(max-width: 48rem)');

	// contents open on large screens, closed on small ones
	const sync = () => { toc.open = !small.matches; };
	sync();
	small.addEventListener('change', sync);
	toc.dataset.ready = '';

	// on small screens, close the list after choosing a section
	toc.addEventListener('click', (e) => {
		if (small.matches && e.target.closest('a')) toc.open = false;
	});

	// highlight the section currently being read
	const links = new Map(
		[...toc.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a])
	);
	const targets = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
	if (!targets.length) return;

	let activeId = '';
	let ticking = false;

	function update() {
		ticking = false;
		const line = doc.getBoundingClientRect().top + 96; // a heading counts as reached 96px below the top
		const atBottom = doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 2;
		let current = targets[0];

		if (atBottom) {
			current = targets[targets.length - 1];
		} else {
			for (const target of targets) {
				if (target.getBoundingClientRect().top <= line) current = target;
				else break;
			}
		}

		if (current.id === activeId) return;
		activeId = current.id;

		links.forEach((link, id) => {
			if (id === activeId) link.setAttribute('aria-current', 'location');
			else link.removeAttribute('aria-current');
		});

		// keep the active link visible if the contents list itself scrolls
		if (toc.open && !small.matches) links.get(activeId).scrollIntoView({ block: 'nearest' });
	}

	doc.addEventListener('scroll', () => {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(update);
		}
	}, { passive: true });

	update();
})();