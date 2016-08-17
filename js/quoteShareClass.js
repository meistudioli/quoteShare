var qsExt = qsExt || {};

qsExt = {
	conf: {
		id: '#qs-trigger',
		title: 'Share Quote',
		uri: 'www.facebook.com/sharer.php'
	},
	params: {
		u: '',
		t: '',
		quote: ''
	},
	iid: '',
	content: '',
	dependencies: [
		'createCSSClass'
	],
	determine: function() {
		var anis, e;
		if (typeof qsExt.isSupport == 'undefined') {
			if (typeof window.getSelection != 'undefined') {
				anis = isAniSupport();
				this.triggerDown = false;
				this.isSupport = true;

				e = {};
				if (typeof anis != 'undefined') {
					e.aniBefore = anis.transform + ':scale(.001);' + anis.origin + ':50% 128%;'; 
					e.aniAfter = anis.transition + ':' + anis.transform +' 300ms cubic-bezier(.17,.67,.5,1.7);' + anis.transform + ':scale(1);';
				} else {
					e.aniBefore = '';
					e.aniAfter = '';
				}//end if

				//params
				e.u = document.querySelector('[rel="canonical"]');
				e.t = document.querySelector('title');
				this.params.u = (e.u) ? e.u.href : location.href;
				this.params.t = (e.t) ? e.t.textContent : '';

				//css
				createCSSClass(this.conf.id, 'position:absolute;font-size:2vmin;line-height:2.5;color:#4b4f56;font-family:arial,helvetica,clean,sans-serif,Microsoft JhengHei,\\5FAE\\8EDF\\6B63\\9ED1\\9AD4;background:#fff;border:1px solid #e5e5e5;padding:0 .45em;border-radius:.33em;box-shadow:0 2px 10px rgba(0,0,0,.3);z-index:1000;'+e.aniBefore);
				createCSSClass(this.conf.id+' span', 'position:relative;padding-left:2.05em;display:block;white-space:nowrap;');
				createCSSClass(this.conf.id+' span:before', 'position:absolute;left:0;top:50%;content:\'\';width:1.6em;height:1.6em;margin-top:-.8em;background-size:100%;background-repeat:no-repeat;display:block;background-image:url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMicgaGVpZ2h0PSczMicgdmlld0JveD0nMCAwIDMyIDMyJz48cGF0aCBmaWxsPScjM0I1OTk4JyBkPSdNMjYuNjY3IDBINS4zMzNDMi4zODggMCAwIDIuMzg4IDAgNS4zMzR2MjEuMzMyQzAgMjkuNjEgMi4zODcgMzIgNS4zMzMgMzJIMTZWMThoLTR2LTRoNHYtM2MwLTIuNzYgMi4yNC01IDUtNWg1djRoLTVjLS41NTIgMC0xIC40NDgtMSAxdjNoNS41bC0xIDRIMjB2MTRoNi42NjdDMjkuNjEgMzIgMzIgMjkuNjEgMzIgMjYuNjY2VjUuMzM0QzMyIDIuMzg4IDI5LjYxMyAwIDI2LjY2NyAweicvPjwvc3ZnPg==\');');
				createCSSClass(this.conf.id+':before', 'content:\'\';position:absolute;left:50%;top:100%;border:.7em solid transparent;border-top-color:#e5e5e5;margin-left:-.7em;');
				createCSSClass(this.conf.id+':after', 'content:\'\';position:absolute;left:50%;top:100%;border:.7em solid transparent;border-top-color:#fff;margin-left:-.7em;margin-top:-1px;');
				createCSSClass(this.conf.id+':active', 'margin-left:.07em;margin-top:.07em;');
				if (e.aniAfter) createCSSClass(this.conf.id+'.act', e.aniAfter);

				//trigger
				[].slice.call(document.querySelectorAll(this.conf.id)).forEach(
					function(node) {
						node.remove();
					}
				);

				this.trigger = mk('', {tag:'a'});
				this.trigger.id = this.conf.id.replace(/#(.*)/, '$1');
				this.trigger.href = '#share';
				this.trigger.title = this.conf.title;
				this.trigger.appendChild(mk('', {tag:'span', att:{textContent:this.conf.title}}));
				document.body.appendChild(this.trigger);

				//idFirst
				e.sets = [];
				for (var i in this.trigger) if (/^id$|^classname$/i.test(i)) e.sets.push(i.toLowerCase());
				e.idFirst = (e.sets[0] == 'id' || isCSSSupport('-moz-appearance')) ? true : false;
				this.maneuver = (e.idFirst) ? this.conf.id + '.maneuver-qs' : '.maneuver-qs' + this.conf.id;

				//evt
				this.trigger.addEventListener('click', qsExt.eAct, false);
				['mousedown', 'mouseup', 'resize'].forEach(
					function(evt) {
						window.addEventListener(evt, qsExt.eAct, false);
					}
				);

				//clear
				for (var i in e) e[i] = null;
				e = null;
			} else this.isSupport = false;
		}//end if
		return qsExt.isSupport;
	},
	eAct: function(e) {
		var sel, range, obj;

		clearTimeout(qsExt.iid);
		obj = tNa(e);

		switch (obj.a) {
			case 'click':
				stopEvents(e);
				break;
			case 'mousedown':
				if (eTrack(obj.t, 'maneuver-qs', 'c')) {
					qsExt.triggerDown = true;
				} else {
					qsExt.triggerDown = false;
					qsExt.toggle(false);
				}//end if
				break;
			default:
				if (obj.a == 'mouseup' && qsExt.triggerDown && eTrack(obj.t, 'maneuver-qs', 'c')) {
					//trigget click
					qsExt.toggle(false);
					qsExt.show();
					return;
				}//end if

				qsExt.iid = setTimeout(
					function() {
						sel = window.getSelection();
						if (!sel.rangeCount || sel.isCollapsed) {
							qsExt.toggle(false);
							return;
						}//end if

						qsExt.params.quote = sel.toString().trim();
						if (!qsExt.params.quote.length) qsExt.toggle(false);
						else {
							qsExt.boundingRect = sel.getRangeAt(0).getBoundingClientRect();
							qsExt.refresh();
						}//end if
					}
				, 100);
		}//end switch
	},
	refresh: function() {
		var size, pos, y;

		size = getSize(qsExt.trigger);
		size[1] = size[1] * 1.28 + 5;//add arrow and subtract gap(5)
		y = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop;

		pos = {
			x: qsExt.boundingRect.left + qsExt.boundingRect.width/2 - size[0]/2, 
			y: y + qsExt.boundingRect.top - size[1]
		};
		createCSSClass(qsExt.maneuver, 'left:'+pos.x+'px;top:'+pos.y+'px;');
		qsExt.toggle(true);
	},
	toggle: function(flag) {
		var act;

		if (flag) act = 'add';
		else {
			act = 'remove';
			qsExt.params.quote = '';
		}//end if

		act = (flag) ? 'add' : 'remove';
		qsExt.trigger.classList[act]('maneuver-qs');
		qsExt.trigger.classList[act]('act');
	},
	show: function() {
		var queryStr;

		queryStr = '//' +this.conf.uri + '?' + Object.keys(this.params).filter(function(key){ return (qsExt.params[key].length) ? true : false; }).map(function(key) { return key + '=' + encodeURIComponent(qsExt.params[key]); }).join('&');
		if (this.openWin && !this.openWin.closed) this.openWin.close();
		this.openWin = window.open(queryStr, 'socialShare', 'toolbar=0,status=0,width=650,height=420', false);
	}
};

/*auto-registration*/
(function() {
	var dependencies, c = 0, max = 10000;//10 seconds
	if (typeof navigator.oRegists == 'undefined') navigator.oRegists = {};
	dependencies = qsExt.dependencies;
	navigator.oRegists.qsExt = setInterval(
		function() {
			var isReady = true;
			c += 5;
			if (c >= max) {
				clearInterval(navigator.oRegists.qsExt);
				return;
			}//end if
			for (var i=-1,l=dependencies.length;++i<l;) {
				var root = window, d = dependencies[i].split('.');
				while (d.length) {
					var prop = d.shift();
					if (!root[prop]) {
						root = null;
						break;
					} else root = root[prop];
				}//end while
				isReady &= (root != null);
			}//end for
			if (isReady && document.body) {
				clearInterval(navigator.oRegists.qsExt);
				navigator.oRegists.qsExt = null;
				qsExt.determine();
			}//end if
		}
	, 5);
})();
//programed by mei(李維翰), http://www.facebook.com/mei.studio.li