/* Physics with Sir Najam — Unit 2 interactive self-check UI.
 * All practice calculations run locally in the browser. No user records are sent.
 */
(function () {
  'use strict';
  const engine = window.PSNVectorMastery;
  const $ = id => document.getElementById(id);
  if (!engine) {
    $('questionText').textContent = 'The practice engine could not load. Please refresh this page.';
    return;
  }

  const ns = 'http://www.w3.org/2000/svg';
  const counters = { components: 0, direction: 0, products: 0 };
  const skillTitles = {
    components: 'Rectangular components',
    direction: 'Magnitude and quadrant',
    products: 'Dot and cross products'
  };
  let task = null;
  let firstTryRecorded = false;
  let firstTryCorrect = 0;
  let submittedCount = 0;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function svg(tag, attrs = {}, label) {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    if (label !== undefined) node.textContent = String(label);
    return node;
  }
  function clear(node) {
    node.replaceChildren();
  }
  function svgLine(root, x1, y1, x2, y2, stroke, width = 2, dash) {
    const attrs = { x1, y1, x2, y2, stroke, 'stroke-width': width };
    if (dash) attrs['stroke-dasharray'] = dash;
    root.appendChild(svg('line', attrs));
  }

  function arrowHead(root, fromX, fromY, toX, toY, color) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const length = 13, wing = 6.5;
    const x1 = toX - length * Math.cos(angle) + wing * Math.sin(angle);
    const y1 = toY - length * Math.sin(angle) - wing * Math.cos(angle);
    const x2 = toX - length * Math.cos(angle) - wing * Math.sin(angle);
    const y2 = toY - length * Math.sin(angle) + wing * Math.cos(angle);
    root.appendChild(svg('polygon', {
      points: toX + ',' + toY + ' ' + x1 + ',' + y1 + ' ' + x2 + ',' + y2,
      fill: color
    }));
  }

  function plotVectors(canvas, vectors, names, axisDescription) {
    clear(canvas);
    const ox = 210, oy = 151;
    const magnitude = Math.max(1, ...vectors.flatMap(v => v.map(Math.abs)));
    const scale = Math.min(117 / magnitude, 60);
    const colors = ['#0c7594', '#c07929'];
    canvas.setAttribute('aria-label', axisDescription);
    canvas.appendChild(svg('title', {}, axisDescription));

    for (let x = 45; x <= 385; x += 34) svgLine(canvas, x, 20, x, 280, '#eaf0f6', 1);
    for (let y = 20; y <= 280; y += 26) svgLine(canvas, 28, y, 393, y, '#eaf0f6', 1);
    svgLine(canvas, 28, oy, 393, oy, '#6c829b', 2);
    svgLine(canvas, ox, 280, ox, 20, '#6c829b', 2);
    arrowHead(canvas, 365, oy, 393, oy, '#6c829b');
    arrowHead(canvas, ox, 53, ox, 20, '#6c829b');
    canvas.appendChild(svg('text', { x: 367, y: oy + 23, 'font-size': 13, fill: '#435872' }, '+x'));
    canvas.appendChild(svg('text', { x: ox + 11, y: 32, 'font-size': 13, fill: '#435872' }, '+y'));
    canvas.appendChild(svg('text', { x: ox - 17, y: oy + 19, 'font-size': 11, fill: '#435872' }, 'O'));
    vectors.forEach((v, i) => {
      const ex = ox + v[0] * scale, ey = oy - v[1] * scale;
      const color = colors[i % colors.length];
      if (vectors.length === 1) {
        svgLine(canvas, ox, oy, ex, oy, '#a5b6c9', 2, '5 4');
        svgLine(canvas, ex, oy, ex, ey, '#a5b6c9', 2, '5 4');
      }
      svgLine(canvas, ox, oy, ex, ey, color, 4);
      arrowHead(canvas, ox, oy, ex, ey, color);
      const label = names[i] || ('V' + (i + 1));
      canvas.appendChild(svg('text', {
        x: Math.min(387, Math.max(18, ex + (v[0] < 0 ? -20 : 11))),
        y: Math.min(285, Math.max(24, ey + (v[1] < 0 ? 18 : -9))),
        'font-size': 16, 'font-weight': 800, fill: color
      }, label));
    });
  }

  function setStatus(message, type = '') {
    const status = $('feedback');
    status.classList.remove('hidden', 'ok', 'bad', 'wait');
    if (type) status.classList.add(type);
    status.textContent = message;
  }
  function resetStatus() {
    $('feedback').className = 'status hidden';
    $('feedback').textContent = '';
  }
  function updateScore() {
    $('score').textContent = 'First-try correct: ' + firstTryCorrect + ' / ' + submittedCount;
  }

  function renderQuestion() {
    if (!task) return;
    $('questionRef').textContent = task.id + ' · ' + task.slo + ' · ' + skillTitles[task.mode];
    $('questionText').textContent = task.question;
    const items = task.inputs.map(input => {
      const wrap = el('div');
      const name = 'response-' + input.key;
      const label = el('label', '', input.label);
      label.htmlFor = name;
      const control = el('input');
      control.id = name;
      control.name = input.key;
      control.type = 'text';
      control.inputMode = 'decimal';
      control.autocomplete = 'off';
      control.placeholder = 'Enter a number';
      control.setAttribute('aria-describedby', name + '-unit');
      const suffix = el('span', 'units', 'Expected units: ' + input.suffix);
      suffix.id = name + '-unit';
      wrap.append(label, control, suffix);
      return wrap;
    });
    $('answerFields').replaceChildren(...items);
    $('hintText').textContent = task.hint;
    $('solutionSteps').replaceChildren(...task.steps.map(step => el('li', '', step)));
    $('hint').classList.add('hidden');
    $('solution').classList.add('hidden');
    $('showHint').textContent = 'Show hint';
    $('showSolution').textContent = 'Show worked solution';
    resetStatus();
    plotVectors($('vectorPlot'), task.plot.vectors, task.plot.names,
      'Diagram of ' + task.plot.names.join(' and ') + ' vector' +
      (task.plot.vectors.length > 1 ? 's' : '') + ' relative to Cartesian x and y axes.');
  }

  function nextChallenge(shouldFocus) {
    const mode = $('mode').value;
    const next = counters[mode]++;
    task = engine.getTask(mode, next);
    firstTryRecorded = false;
    renderQuestion();
    if (shouldFocus) {
      const first = $('answerFields').querySelector('input');
      if (first) first.focus();
    }
  }

  function checkChallenge(event) {
    event.preventDefault();
    if (!task) return;
    const responses = {};
    for (const field of task.inputs) responses[field.key] = $('response-' + field.key).value;
    const outcome = engine.check(task, responses);
    if (!outcome.complete) {
      setStatus('Please enter a valid numeric value in both fields before checking.', 'wait');
      return;
    }
    if (!firstTryRecorded) {
      firstTryRecorded = true;
      submittedCount++;
      if (outcome.correct) firstTryCorrect++;
      updateScore();
    }
    if (outcome.correct) {
      setStatus('Correct! Both values agree with the vector relationships. Try another challenge or review the method.', 'ok');
    } else {
      const labels = outcome.fields
        .filter(result => !result.correct)
        .map(result => task.inputs.find(input => input.key === result.key).label);
      setStatus('Not quite. Recheck: ' + labels.join(' and ') +
        '. Use the hint, inspect the diagram and check signs, then try again.', 'bad');
    }
  }

  function togglePanel(id, buttonId, openLabel, closeLabel) {
    const target = $(id);
    target.classList.toggle('hidden');
    $(buttonId).textContent = target.classList.contains('hidden') ? openLabel : closeLabel;
  }

  function updateAngleExplorer() {
    const theta = Number($('angleRange').value);
    const result = engine.explore(5, 4, theta);
    $('angleLabel').textContent = theta + '°';
    $('dotValue').textContent = engine.fmt(result.dot, 2);
    $('crossValue').textContent = engine.fmt(result.crossMagnitude, 2);
    if (theta === 0) $('angleInsight').textContent = 'Parallel vectors: dot = +AB, cross magnitude = 0.';
    else if (theta === 90) $('angleInsight').textContent = 'Perpendicular vectors: dot = 0, cross magnitude is maximum at AB = 20.';
    else if (theta === 180) $('angleInsight').textContent = 'Antiparallel vectors: dot = −AB, cross magnitude = 0.';
    else if (theta === 45 || theta === 135) {
      $('angleInsight').textContent = 'At 45° and 135°, |dot| = |cross|. The dot is positive at 45° and negative at 135° — the sign matters.';
    } else {
      $('angleInsight').textContent = 'Dot product can be positive or negative; cross-product magnitude stays non-negative for 0°–180°.';
    }
    const thetaRadians = theta * Math.PI / 180;
    plotVectors($('anglePlot'), [[5, 0], [4 * Math.cos(thetaRadians), 4 * Math.sin(thetaRadians)]],
      ['A', 'B'], 'Angle explorer: A along positive x, B rotated anticlockwise by ' + theta + ' degrees.');
  }

  $('challengeForm').addEventListener('submit', checkChallenge);
  $('newTask').addEventListener('click', () => nextChallenge(true));
  $('mode').addEventListener('change', () => nextChallenge(false));
  $('showHint').addEventListener('click', () =>
    togglePanel('hint', 'showHint', 'Show hint', 'Hide hint'));
  $('showSolution').addEventListener('click', () =>
    togglePanel('solution', 'showSolution', 'Show worked solution', 'Hide solution'));
  $('angleRange').addEventListener('input', updateAngleExplorer);
  for (const preset of document.querySelectorAll('[data-angle]')) {
    preset.addEventListener('click', () => {
      $('angleRange').value = preset.getAttribute('data-angle');
      updateAngleExplorer();
    });
  }

  nextChallenge(false);
  updateAngleExplorer();
})();
