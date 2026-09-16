// =========================================================
// BURN - Performance Charts & Visualizer Engine (Pure SVG)
// =========================================================
(function() {
  "use strict";

  window.BURN_CHARTS = {
    // Generate an interactive, responsive SVG performance trend chart
    // dataPoints: [{ label: "Aug 12", value: 100 }, ...]
    renderTrendChart(dataPoints, metricTitle = "MAX WEIGHT", unit = "kg") {
      if (!dataPoints || dataPoints.length === 0) {
        return `
          <div class="h-36 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/60 rounded-xl border border-zinc-900">
            <span class="text-xs font-bold uppercase tracking-wider">No workout data recorded yet</span>
            <span class="text-[10px] text-zinc-700 mt-1">Complete sets to plot performance history</span>
          </div>
        `;
      }

      if (dataPoints.length === 1) {
        const pt = dataPoints[0];
        return `
          <div class="h-36 flex flex-col items-center justify-center bg-zinc-950/60 rounded-xl border border-zinc-900 p-4">
            <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">${metricTitle} BASELINE</span>
            <span class="text-3xl font-black text-blue-400 mt-1">${pt.value} <span class="text-sm font-bold text-zinc-500">${unit}</span></span>
            <span class="text-[10px] text-zinc-400 mt-1">${pt.label}</span>
          </div>
        `;
      }

      const values = dataPoints.map(d => Number(d.value) || 0);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const range = maxVal === minVal ? (maxVal || 1) : (maxVal - minVal);

      const width = 340;
      const height = 140;
      const padTop = 20;
      const padBottom = 26;
      const padLeft = 32;
      const padRight = 20;

      const chartW = width - padLeft - padRight;
      const chartH = height - padTop - padBottom;

      const points = dataPoints.map((d, i) => {
        const x = padLeft + (i / (dataPoints.length - 1)) * chartW;
        const normalizedY = (d.value - minVal) / range;
        const y = padTop + chartH - (normalizedY * chartH);
        return { x, y, val: d.value, label: d.label };
      });

      const pathD = points.reduce((acc, pt, i) => {
        return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, "");

      // Area fill path
      const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

      const circles = points.map(pt => `
        <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" />
        <text x="${pt.x}" y="${pt.y - 7}" text-anchor="middle" fill="#93c5fd" font-size="9" font-weight="bold">${pt.val}</text>
      `).join("");

      const xLabels = points.map((pt, i) => {
        // Show first, middle, and last to avoid clutter
        if (i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)) {
          return `<text x="${pt.x}" y="${height - 6}" text-anchor="middle" fill="#71717a" font-size="8" font-weight="bold">${pt.label}</text>`;
        }
        return "";
      }).join("");

      return `
        <div class="w-full overflow-hidden bg-zinc-950/80 rounded-2xl border border-zinc-800 p-3">
          <div class="flex justify-between items-center mb-1 px-1">
            <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest">${metricTitle} PROGRESSION</span>
            <span class="text-[10px] font-mono font-bold text-zinc-400">Current: <strong class="text-white">${values[values.length - 1]} ${unit}</strong></span>
          </div>
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto overflow-visible select-none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Guide grid line -->
            <line x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}" stroke="#27272a" stroke-dasharray="3,3" stroke-width="1" />
            <line x1="${padLeft}" y1="${padTop + chartH}" x2="${width - padRight}" y2="${padTop + chartH}" stroke="#27272a" stroke-width="1" />

            <!-- Y Axis indicators -->
            <text x="${padLeft - 6}" y="${padTop + 4}" text-anchor="end" fill="#52525b" font-size="8" font-mono>${Math.round(maxVal)}</text>
            <text x="${padLeft - 6}" y="${padTop + chartH + 3}" text-anchor="end" fill="#52525b" font-size="8" font-mono>${Math.round(minVal)}</text>

            <!-- Gradient Area -->
            <path d="${areaD}" fill="url(#chartGrad)" />

            <!-- Line Path -->
            <path d="${pathD}" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Circles & Values -->
            ${circles}

            <!-- X Labels -->
            ${xLabels}
          </svg>
        </div>
      `;
    }
  };
})();
