const CH7 = {
  title: "IQ 調適與評估",
  sections: [
    {
      id: "ch7_1",
      title: "IQ Tuning 方法論",
      content: `
<h3>什麼是 IQ Tuning？</h3>
<p><strong>IQ Tuning（影像品質調適）</strong>是 ISP 開發中最關鍵也最耗時的環節。一套 ISP 硬體和演算法的設計再好，如果參數沒有調好，影像品質可能還不如基礎但調適優良的方案。IQ Tuning 的目標是在特定的相機系統（鏡頭 + Sensor + ISP）上，找到一組最佳的 ISP 參數設定，使影像品質在各種場景和光照條件下都達到令人滿意的水準。</p>

<p>IQ Tuning 涉及 ISP Pipeline 中的數十到數百個參數，包括但不限於：Black Level、Lens Shading Correction、White Balance、Color Correction Matrix、Gamma/Tone Curve、Noise Reduction、Sharpening、Saturation、Contrast 等。每個參數都可能隨 ISO / 光照 / 色溫 / 場景而變，組合空間極其龐大。</p>

<div class="diagram"><svg viewBox="0 0 650 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="380" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">系統化 IQ Tuning 工作流程</text>
  <defs>
    <marker id="arrowT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
    <marker id="arrowG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6a8a7a"/></marker>
  </defs>
  <!-- Phase 1: Calibration -->
  <rect x="30" y="45" width="180" height="65" rx="8" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="120" y="67" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Phase 1：基礎校準</text>
  <text x="120" y="82" fill="#5a5550" font-size="10" text-anchor="middle">BLC · LSC · DPC</text>
  <text x="120" y="96" fill="#8a8580" font-size="9" text-anchor="middle">Dark Frame / Flat Field 量測</text>
  <line x1="210" y1="78" x2="240" y2="78" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 2: Color -->
  <rect x="245" y="45" width="180" height="65" rx="8" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="335" y="67" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">Phase 2：色彩校準</text>
  <text x="335" y="82" fill="#5a5550" font-size="10" text-anchor="middle">AWB · CCM · Gamma</text>
  <text x="335" y="96" fill="#8a8580" font-size="9" text-anchor="middle">Macbeth Chart 量測</text>
  <line x1="425" y1="78" x2="455" y2="78" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 3: NR+Sharp -->
  <rect x="460" y="45" width="160" height="65" rx="8" fill="rgba(100,140,180,0.12)" stroke="#648cb4" stroke-width="1.5"/>
  <text x="540" y="67" fill="#648cb4" font-size="12" text-anchor="middle" font-weight="500">Phase 3：NR + 銳化</text>
  <text x="540" y="82" fill="#5a5550" font-size="10" text-anchor="middle">NR · Sharpening · Coring</text>
  <text x="540" y="96" fill="#8a8580" font-size="9" text-anchor="middle">各 ISO / 亮度分別調適</text>
  <!-- Arrow down -->
  <line x1="540" y1="110" x2="540" y2="140" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 4: Tone & HDR -->
  <rect x="420" y="145" width="200" height="65" rx="8" fill="rgba(160,130,180,0.12)" stroke="#a082b4" stroke-width="1.5"/>
  <text x="520" y="167" fill="#a082b4" font-size="12" text-anchor="middle" font-weight="500">Phase 4：Tone / HDR</text>
  <text x="520" y="182" fill="#5a5550" font-size="10" text-anchor="middle">Tone Curve · LTM · HDR merge</text>
  <text x="520" y="196" fill="#8a8580" font-size="9" text-anchor="middle">動態範圍與對比度調整</text>
  <line x1="420" y1="178" x2="390" y2="178" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 5: Scene-adaptive -->
  <rect x="180" y="145" width="205" height="65" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="282" y="167" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Phase 5：場景自適應</text>
  <text x="282" y="182" fill="#5a5550" font-size="10" text-anchor="middle">場景偵測 · 人臉 · 夜景 · 逆光</text>
  <text x="282" y="196" fill="#8a8580" font-size="9" text-anchor="middle">Per-scene 參數切換</text>
  <line x1="282" y1="210" x2="282" y2="240" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 6: Subjective tuning -->
  <rect x="130" y="245" width="300" height="55" rx="8" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="280" y="267" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">Phase 6：主觀微調與驗收</text>
  <text x="280" y="286" fill="#5a5550" font-size="10" text-anchor="middle">A/B Test · 真實場景拍攝 · 盲測比較 · 客戶 Review</text>
  <!-- Feedback loops -->
  <path d="M130,270 Q50,270 50,178 Q50,78 30,78" fill="none" stroke="#6a8a7a" stroke-width="1.2" stroke-dasharray="5,3" marker-end="url(#arrowG)"/>
  <text x="40" y="180" fill="#6a8a7a" font-size="9" transform="rotate(-90,40,180)">迭代回饋</text>
  <!-- Bottom notes -->
  <rect x="80" y="320" width="490" height="45" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="338" fill="#5a5550" font-size="11" text-anchor="middle">每個 Phase 都需要在多個光照條件下測試（D65, TL84, A, CWF, Outdoor, ...）</text>
  <text x="325" y="355" fill="#8a8580" font-size="10" text-anchor="middle">典型的 IQ Tuning 週期：初始 2~4 週 → 迭代優化 4~8 週 → 驗收 1~2 週</text>
</svg><div class="caption">圖 7-1：系統化 IQ Tuning 工作流程 — 從基礎校準到主觀驗收的完整循環</div></div>

<h3>IQ Tuning 的核心原則</h3>
<ol>
  <li><strong>由粗到細</strong>：先確保基礎校準正確（BLC、LSC），再調色彩，再調 NR/銳化，最後做場景微調</li>
  <li><strong>先客觀後主觀</strong>：先用測試圖卡和量測工具達到客觀指標，再進行主觀評價和調整</li>
  <li><strong>交叉驗證</strong>：每調完一個模組，都要回去檢查之前調好的模組是否被影響</li>
  <li><strong>多場景覆蓋</strong>：不要只在實驗室中調適，需要大量真實場景的驗證</li>
  <li><strong>記錄與版本管理</strong>：每次調整都要記錄參數變動和效果對比，便於回溯</li>
</ol>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  IQ Tuning 不是簡單的「調參數」，它是一個系統性的工程過程。好的 Tuning 工程師需要深入理解 ISP 每個模組的原理、它們之間的交互影響、人眼的視覺特性、以及目標應用場景的需求。
</div>

<h3>常見的 IQ Tuning 挑戰</h3>
<ul>
  <li><strong>參數交互耦合</strong>：改動一個模組的參數，可能連帶影響其他模組的效果（如改 Gamma 會影響 NR 和銳化的表現）</li>
  <li><strong>場景多樣性</strong>：實驗室中調好的參數，在真實場景中可能不理想</li>
  <li><strong>主觀差異</strong>：不同的人（客戶、使用者）對「好的影像」有不同的偏好</li>
  <li><strong>平台差異</strong>：同一影像在不同螢幕上看起來會不同</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議建立一套標準化的 Tuning 檢查清單（Checklist），涵蓋每個 Phase 需要檢查的項目、使用的測試圖卡、量測指標和通過標準。這可以大幅提升 Tuning 的效率和一致性，特別是在團隊協作時。
</div>
`,
      keyPoints: [
        "IQ Tuning 是 ISP 開發中最關鍵也最耗時的環節",
        "工作流程分為 6 個 Phase：基礎校準 → 色彩 → NR/銳化 → Tone → 場景自適應 → 主觀微調",
        "核心原則：由粗到細、先客觀後主觀、交叉驗證、多場景覆蓋",
        "參數交互耦合是最大挑戰 — 需要系統性的迭代方法",
        "標準化 Checklist 能大幅提升 Tuning 效率"
      ]
    },
    {
      id: "ch7_2",
      title: "測試圖卡 Test Charts",
      content: `
<h3>標準測試圖卡的重要性</h3>
<p>在 IQ Tuning 和評估中，使用<strong>標準化的測試圖卡（Test Charts）</strong>是客觀量測的基礎。測試圖卡提供了已知的、可重現的測試目標，使得量測結果具有可比較性和可追溯性。</p>

<h3>Macbeth ColorChecker（24 色卡）</h3>
<p><strong>X-Rite ColorChecker Classic（Macbeth 24-patch）</strong>是色彩校準中最廣泛使用的圖卡。它包含 24 個精心選擇的色塊，涵蓋了自然色彩、灰階、飽和色等。</p>

<div class="diagram"><svg viewBox="0 0 620 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="620" height="350" fill="#f5f0eb" rx="8"/>
  <text x="310" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Macbeth ColorChecker 24-patch 色卡佈局</text>
  <!-- Card background -->
  <rect x="35" y="40" width="550" height="230" rx="6" fill="#3a3530" stroke="#5a5550" stroke-width="1.5"/>
  <!-- 4 rows x 6 columns -->
  <!-- Row 1: Natural colors -->
  <rect x="55" y="55" width="75" height="45" rx="3" fill="#735244"/>
  <text x="92" y="90" fill="#ddd" font-size="7" text-anchor="middle">Dark Skin</text>
  <rect x="140" y="55" width="75" height="45" rx="3" fill="#c29682"/>
  <text x="177" y="90" fill="#444" font-size="7" text-anchor="middle">Light Skin</text>
  <rect x="225" y="55" width="75" height="45" rx="3" fill="#627a9d"/>
  <text x="262" y="90" fill="#ddd" font-size="7" text-anchor="middle">Blue Sky</text>
  <rect x="310" y="55" width="75" height="45" rx="3" fill="#576c43"/>
  <text x="347" y="90" fill="#ddd" font-size="7" text-anchor="middle">Foliage</text>
  <rect x="395" y="55" width="75" height="45" rx="3" fill="#8580b1"/>
  <text x="432" y="90" fill="#ddd" font-size="7" text-anchor="middle">Blue Flower</text>
  <rect x="480" y="55" width="75" height="45" rx="3" fill="#67bdaa"/>
  <text x="517" y="90" fill="#444" font-size="7" text-anchor="middle">Bluish Green</text>
  <!-- Row 2: Miscellaneous -->
  <rect x="55" y="110" width="75" height="45" rx="3" fill="#d67e2c"/>
  <text x="92" y="145" fill="#444" font-size="7" text-anchor="middle">Orange</text>
  <rect x="140" y="110" width="75" height="45" rx="3" fill="#505ba6"/>
  <text x="177" y="145" fill="#ddd" font-size="7" text-anchor="middle">Purplish Blue</text>
  <rect x="225" y="110" width="75" height="45" rx="3" fill="#c15a63"/>
  <text x="262" y="145" fill="#ddd" font-size="7" text-anchor="middle">Moderate Red</text>
  <rect x="310" y="110" width="75" height="45" rx="3" fill="#5e3c6c"/>
  <text x="347" y="145" fill="#ddd" font-size="7" text-anchor="middle">Purple</text>
  <rect x="395" y="110" width="75" height="45" rx="3" fill="#9dbc40"/>
  <text x="432" y="145" fill="#444" font-size="7" text-anchor="middle">Yellow Green</text>
  <rect x="480" y="110" width="75" height="45" rx="3" fill="#e0a32e"/>
  <text x="517" y="145" fill="#444" font-size="7" text-anchor="middle">Orange Yellow</text>
  <!-- Row 3: Saturated -->
  <rect x="55" y="165" width="75" height="45" rx="3" fill="#383d96"/>
  <text x="92" y="200" fill="#ddd" font-size="7" text-anchor="middle">Blue</text>
  <rect x="140" y="165" width="75" height="45" rx="3" fill="#469449"/>
  <text x="177" y="200" fill="#ddd" font-size="7" text-anchor="middle">Green</text>
  <rect x="225" y="165" width="75" height="45" rx="3" fill="#af363c"/>
  <text x="262" y="200" fill="#ddd" font-size="7" text-anchor="middle">Red</text>
  <rect x="310" y="165" width="75" height="45" rx="3" fill="#e7c71f"/>
  <text x="347" y="200" fill="#444" font-size="7" text-anchor="middle">Yellow</text>
  <rect x="395" y="165" width="75" height="45" rx="3" fill="#bb5695"/>
  <text x="432" y="200" fill="#ddd" font-size="7" text-anchor="middle">Magenta</text>
  <rect x="480" y="165" width="75" height="45" rx="3" fill="#0885a1"/>
  <text x="517" y="200" fill="#ddd" font-size="7" text-anchor="middle">Cyan</text>
  <!-- Row 4: Grayscale -->
  <rect x="55" y="220" width="75" height="40" rx="3" fill="#f3f3f2"/>
  <text x="92" y="248" fill="#888" font-size="7" text-anchor="middle">White</text>
  <rect x="140" y="220" width="75" height="40" rx="3" fill="#c8c8c8"/>
  <text x="177" y="248" fill="#888" font-size="7" text-anchor="middle">Neutral 8</text>
  <rect x="225" y="220" width="75" height="40" rx="3" fill="#a0a0a0"/>
  <text x="262" y="248" fill="#ddd" font-size="7" text-anchor="middle">Neutral 6.5</text>
  <rect x="310" y="220" width="75" height="40" rx="3" fill="#7a7a79"/>
  <text x="347" y="248" fill="#ddd" font-size="7" text-anchor="middle">Neutral 5</text>
  <rect x="395" y="220" width="75" height="40" rx="3" fill="#555555"/>
  <text x="432" y="248" fill="#ddd" font-size="7" text-anchor="middle">Neutral 3.5</text>
  <rect x="480" y="220" width="75" height="40" rx="3" fill="#343434"/>
  <text x="517" y="248" fill="#ddd" font-size="7" text-anchor="middle">Black</text>
  <!-- Labels -->
  <text x="30" y="82" fill="#8a8580" font-size="9" text-anchor="end">自然色</text>
  <text x="30" y="137" fill="#8a8580" font-size="9" text-anchor="end">混合色</text>
  <text x="30" y="192" fill="#8a8580" font-size="9" text-anchor="end">飽和色</text>
  <text x="30" y="245" fill="#8a8580" font-size="9" text-anchor="end">灰階</text>
  <!-- Usage notes -->
  <text x="310" y="295" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">主要用途：AWB 校準、CCM 計算、ΔE 量測、灰階線性度</text>
  <rect x="60" y="305" width="250" height="30" rx="4" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="185" y="324" fill="#6a8a7a" font-size="10" text-anchor="middle">底排灰階：驗證 Gamma / Tone Curve</text>
  <rect x="330" y="305" width="250" height="30" rx="4" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="455" y="324" fill="#c4a064" font-size="10" text-anchor="middle">前三排色塊：色彩準確性評估</text>
</svg><div class="caption">圖 7-2：Macbeth ColorChecker 24-patch 色卡佈局與用途</div></div>

<h3>ISO 12233 解析力測試圖</h3>
<p><strong>ISO 12233</strong> 是量測相機空間解析力的國際標準。常見的測試圖卡包含：</p>
<ul>
  <li><strong>Slanted Edge</strong>：傾斜 5° 的黑白邊緣，用於計算 SFR/MTF（最常用）</li>
  <li><strong>Siemens Star</strong>：放射狀的黑白扇形，可觀察不同方向的解析力</li>
  <li><strong>Hyperbolic Wedge</strong>：漸變的線對，可直觀看出解析力極限</li>
  <li><strong>Dead Leaves</strong>：模擬自然紋理的圖案，評估 Texture MTF</li>
</ul>

<h3>其他重要測試圖卡</h3>
<table>
  <tr><th>圖卡</th><th>用途</th><th>關鍵指標</th></tr>
  <tr><td>TE42 (Imatest)</td><td>綜合 IQ 評估</td><td>MTF、色彩、噪聲、動態範圍</td></tr>
  <tr><td>DNP Chart</td><td>動態範圍量測</td><td>SNR、Dynamic Range</td></tr>
  <tr><td>Distortion Grid</td><td>鏡頭畸變量測</td><td>TV Distortion %</td></tr>
  <tr><td>Uniformity Chart</td><td>均勻性量測</td><td>亮度 / 色彩均勻性</td></tr>
  <tr><td>Skin Tone Chart</td><td>膚色準確性</td><td>膚色 ΔE</td></tr>
</table>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意事項</div>
  <ul>
    <li>圖卡需要在<strong>均勻照明</strong>下拍攝，避免光線不均勻導致量測偏差</li>
    <li>圖卡應佔畫面的<strong>適當比例</strong>（通常 60-80%），不要太近也不要太遠</li>
    <li>確保圖卡<strong>平整無翹曲</strong>，且與相機平面平行</li>
    <li>定期<strong>更換或校驗</strong>圖卡，因為色塊會隨時間褪色</li>
  </ul>
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在團隊合作中，建議建立統一的圖卡拍攝 SOP（Standard Operating Procedure），包括光源類型、照度要求、曝光設定、拍攝角度和距離等。這確保了不同工程師、不同時間的量測結果具有可比較性。
</div>
`,
      keyPoints: [
        "Macbeth 24-patch 是色彩校準的基礎圖卡，用於 AWB、CCM、ΔE",
        "ISO 12233 用於解析力量測，Slanted Edge 法最為常用",
        "不同測試項目需要不同的專用圖卡",
        "圖卡拍攝需嚴格控制照明、距離和角度",
        "標準化 SOP 確保量測結果的可重現性和可比較性"
      ]
    },
    {
      id: "ch7_3",
      title: "SNR 與 Dynamic Range 量測",
      content: `
<h3>SNR（Signal-to-Noise Ratio）</h3>
<p><strong>SNR（信噪比）</strong>是衡量影像品質最基本的指標之一。它定義為信號功率與噪聲功率之比，通常以 dB 表示：</p>
<div class="formula">SNR (dB) = 20 × log₁₀(Signal / Noise) = 20 × log₁₀(μ / σ)</div>
<p>其中 μ 是均值（信號），σ 是標準差（噪聲）。</p>

<h3>SNR 量測方法</h3>
<p>標準的 SNR 量測方法是拍攝均勻灰度圖卡（或使用 Macbeth 灰階色塊），在每個灰度級別上測量均值和標準差。</p>

<div class="diagram"><svg viewBox="0 0 650 330" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="330" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">SNR 量測設定與 SNR 曲線</text>
  <!-- Left: Setup -->
  <rect x="25" y="45" width="240" height="150" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="145" y="68" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">量測設定</text>
  <!-- Light source -->
  <rect x="45" y="82" width="60" height="30" rx="4" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1"/>
  <text x="75" y="101" fill="#c4a064" font-size="9" text-anchor="middle">Light</text>
  <!-- Chart -->
  <rect x="125" y="78" width="50" height="40" rx="3" fill="#aaa" stroke="#888" stroke-width="1"/>
  <text x="150" y="102" fill="#fff" font-size="8" text-anchor="middle">Gray</text>
  <!-- Camera -->
  <rect x="195" y="82" width="50" height="30" rx="4" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="220" y="101" fill="#6a8a7a" font-size="9" text-anchor="middle">Camera</text>
  <!-- Steps -->
  <text x="145" y="140" fill="#5a5550" font-size="10" text-anchor="middle">1. 拍攝 N 張相同灰度</text>
  <text x="145" y="155" fill="#5a5550" font-size="10" text-anchor="middle">2. 計算 ROI 內 μ 和 σ</text>
  <text x="145" y="170" fill="#5a5550" font-size="10" text-anchor="middle">3. SNR = 20 log₁₀(μ/σ)</text>
  <text x="145" y="185" fill="#8a8580" font-size="9" text-anchor="middle">或拍單張多灰度圖卡</text>
  <!-- Right: SNR curve -->
  <rect x="290" y="45" width="340" height="260" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <!-- Axes -->
  <line x1="340" y1="70" x2="340" y2="270" stroke="#5a5550" stroke-width="1"/>
  <line x1="340" y1="270" x2="600" y2="270" stroke="#5a5550" stroke-width="1"/>
  <text x="320" y="170" fill="#8a8580" font-size="10" text-anchor="middle" transform="rotate(-90,320,170)">SNR (dB)</text>
  <text x="470" y="290" fill="#8a8580" font-size="10" text-anchor="middle">信號水準 (DN / Lux)</text>
  <!-- Y axis labels -->
  <text x="333" y="85" fill="#8a8580" font-size="9" text-anchor="end">40</text>
  <text x="333" y="135" fill="#8a8580" font-size="9" text-anchor="end">30</text>
  <text x="333" y="185" fill="#8a8580" font-size="9" text-anchor="end">20</text>
  <text x="333" y="235" fill="#8a8580" font-size="9" text-anchor="end">10</text>
  <text x="333" y="273" fill="#8a8580" font-size="9" text-anchor="end">0</text>
  <!-- Grid lines -->
  <line x1="340" y1="80" x2="600" y2="80" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="340" y1="130" x2="600" y2="130" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="340" y1="180" x2="600" y2="180" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="340" y1="230" x2="600" y2="230" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <!-- Shot noise limited line (ideal) -->
  <path d="M360,260 Q420,190 500,120 Q560,80 590,70" fill="none" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="6,3"/>
  <!-- Real SNR curve (with read noise floor) -->
  <path d="M360,265 Q400,230 440,190 Q490,140 530,110 Q560,95 590,88" fill="none" stroke="#5a5550" stroke-width="2.5"/>
  <!-- After NR -->
  <path d="M360,255 Q400,210 440,170 Q490,120 530,95 Q560,82 590,76" fill="none" stroke="#c4a064" stroke-width="2" stroke-dasharray="4,3"/>
  <!-- Read noise floor -->
  <line x1="340" y1="258" x2="380" y2="258" stroke="#8a8580" stroke-width="1" stroke-dasharray="3"/>
  <text x="385" y="262" fill="#8a8580" font-size="8">Read Noise Floor</text>
  <!-- Legend -->
  <line x1="360" y1="300" x2="380" y2="300" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="385" y="304" fill="#5a5550" font-size="9">Shot Noise Limited (Ideal)</text>
  <line x1="490" y1="300" x2="510" y2="300" stroke="#5a5550" stroke-width="2.5"/>
  <text x="515" y="304" fill="#5a5550" font-size="9">Real (before NR)</text>
</svg><div class="caption">圖 7-3：SNR 量測設定（左）與 SNR vs 信號水準曲線（右）</div></div>

<h3>SNR 曲線的解讀</h3>
<ul>
  <li><strong>低信號區</strong>：SNR 由 Read Noise 主導，隨信號緩慢上升</li>
  <li><strong>中信號區</strong>：SNR 受 Shot Noise 主導，與 √Signal 成正比，曲線斜率約 10 dB/decade</li>
  <li><strong>高信號區</strong>：接近飽和，SNR 趨近於最大值或因非線性開始下降</li>
  <li>ISP 降噪後的 SNR 曲線應整體上移（改善），但要注意是否同時損失了紋理細節</li>
</ul>

<h3>Dynamic Range（動態範圍）</h3>
<p><strong>Dynamic Range</strong> 定義為系統能記錄的最大與最小信號之比：</p>
<div class="formula">DR (dB) = 20 × log₁₀(Signal_max / Noise_floor)</div>

<p>或以 EV（Exposure Value，即「檔」）表示：</p>
<div class="formula">DR (EV) = log₂(Signal_max / Noise_floor)</div>

<p>在 ISP 量測中，Dynamic Range 通常用 SNR = 0 dB（或 1 dB）作為截止點 — 即信號等於噪聲的位置。</p>

<h3>量測方法</h3>
<table>
  <tr><th>方法</th><th>說明</th><th>優缺點</th></tr>
  <tr><td>漸變灰階圖卡</td><td>拍攝多個灰度級別，計算每級的 SNR</td><td>簡單直觀，但灰階級數有限</td></tr>
  <tr><td>多曝光法</td><td>固定場景，改變曝光時間，合成完整曲線</td><td>可涵蓋完整範圍，但需穩定光源</td></tr>
  <tr><td>透光密度梯度圖卡</td><td>連續密度變化的圖卡，一次拍攝涵蓋大範圍</td><td>效率高，但圖卡品質要求高</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  SNR 是 IQ 的基石。ISP 中的每一步處理（降噪、銳化、Tone Mapping、JPEG 壓縮）都會影響最終的 SNR。好的 ISP Tuning 要確保在每一步中盡可能保留甚至改善 SNR，而不是只看最終的視覺效果。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在量測 SNR 時，建議同時拍攝多張相同設定的影像（至少 8-16 張），使用時間平均法（Temporal Mean/Variance）來分離固定模式噪聲（FPN）和隨機噪聲。單張影像的 ROI 方法雖然簡便，但容易受到圖卡不均勻和 Lens Shading 的影響。
</div>
`,
      keyPoints: [
        "SNR = 20 × log₁₀(μ/σ)，是影像品質最基本的指標",
        "SNR 曲線受 Read Noise（低信號）和 Shot Noise（中信號）主導",
        "Dynamic Range 定義為最大信號與噪聲底限之比",
        "量測時需嚴格控制照明、曝光，建議多張取平均",
        "ISP 每一步處理都會影響 SNR，需全程監控"
      ]
    },
    {
      id: "ch7_4",
      title: "MTF/SFR 量測",
      content: `
<h3>SFR（Spatial Frequency Response）</h3>
<p><strong>SFR</strong> 與 <strong>MTF</strong> 在概念上等價，都描述系統在不同空間頻率下的響應。SFR 這個術語在 ISO 12233 標準中使用，強調的是「整個系統」（鏡頭 + Sensor + ISP）的空間頻率響應，而非單一元件的 MTF。</p>

<h3>Slanted Edge 量測法</h3>
<p>Slanted Edge（傾斜邊緣）法是目前最主流的 MTF/SFR 量測方法，被 ISO 12233 標準採用。其原理是：</p>

<div class="diagram"><svg viewBox="0 0 650 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="340" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Slanted Edge MTF 量測方法</text>
  <defs><marker id="arrowS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Step 1: Slanted Edge -->
  <rect x="20" y="50" width="130" height="110" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="85" y="70" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">Step 1: 拍攝</text>
  <!-- Slanted edge illustration -->
  <rect x="35" y="80" width="100" height="70" rx="2" fill="#eee" stroke="#ccc" stroke-width="1"/>
  <polygon points="35,80 95,80 95,150 35,150" fill="#333"/>
  <!-- ~5 degree slant -->
  <polygon points="35,80 90,80 90,150 35,140" fill="#333"/>
  <text x="85" y="100" fill="#fff" font-size="8" text-anchor="middle">Dark</text>
  <text x="115" y="130" fill="#888" font-size="8" text-anchor="middle">Light</text>
  <text x="65" y="158" fill="#8a8580" font-size="8" text-anchor="middle">~5° 傾斜邊緣</text>
  <!-- Arrow -->
  <line x1="150" y1="105" x2="180" y2="105" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowS)"/>
  <!-- Step 2: ESF -->
  <rect x="185" y="50" width="130" height="110" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="250" y="70" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">Step 2: ESF</text>
  <!-- ESF curve -->
  <path d="M200,140 L220,140 Q240,140 250,100 Q260,80 270,80 L300,80" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="250" y="155" fill="#8a8580" font-size="8" text-anchor="middle">Edge Spread Function</text>
  <!-- Arrow -->
  <line x1="315" y1="105" x2="345" y2="105" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowS)"/>
  <!-- Step 3: LSF (derivative) -->
  <rect x="350" y="50" width="130" height="110" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="415" y="70" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">Step 3: LSF</text>
  <!-- LSF curve (bell-like) -->
  <path d="M365,140 L385,140 Q400,140 410,90 Q415,75 420,90 Q430,140 445,140 L465,140" fill="none" stroke="#c4a064" stroke-width="2"/>
  <text x="415" y="155" fill="#8a8580" font-size="8" text-anchor="middle">= d(ESF)/dx</text>
  <!-- Arrow -->
  <line x1="480" y1="105" x2="510" y2="105" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowS)"/>
  <!-- Step 4: MTF (FFT) -->
  <rect x="515" y="50" width="120" height="110" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="575" y="70" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">Step 4: MTF</text>
  <!-- MTF curve -->
  <path d="M530,80 Q560,85 580,110 Q600,135 620,145" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="575" y="155" fill="#8a8580" font-size="8" text-anchor="middle">= |FFT(LSF)|</text>
  <!-- Bottom: MTF curve detail -->
  <rect x="50" y="185" width="550" height="140" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="325" y="205" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">MTF 曲線與關鍵指標</text>
  <!-- Axes -->
  <line x1="100" y1="215" x2="100" y2="305" stroke="#5a5550" stroke-width="1"/>
  <line x1="100" y1="305" x2="560" y2="305" stroke="#5a5550" stroke-width="1"/>
  <text x="80" y="225" fill="#8a8580" font-size="9" text-anchor="end">1.0</text>
  <text x="80" y="265" fill="#8a8580" font-size="9" text-anchor="end">0.5</text>
  <text x="80" y="295" fill="#8a8580" font-size="9" text-anchor="end">0.1</text>
  <text x="330" y="320" fill="#8a8580" font-size="9" text-anchor="middle">空間頻率 (cycles/pixel)</text>
  <!-- Grid -->
  <line x1="100" y1="260" x2="560" y2="260" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3"/>
  <line x1="100" y1="290" x2="560" y2="290" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3"/>
  <!-- MTF curve -->
  <path d="M100,218 Q200,225 280,260 Q380,288 480,300 Q530,303 560,305" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- MTF50 marker -->
  <line x1="280" y1="255" x2="280" y2="310" stroke="#c4a064" stroke-width="1.2" stroke-dasharray="4"/>
  <text x="280" y="318" fill="#c4a064" font-size="9" text-anchor="middle" font-weight="500">MTF50</text>
  <!-- MTF10 marker -->
  <line x1="450" y1="288" x2="450" y2="310" stroke="#648cb4" stroke-width="1.2" stroke-dasharray="4"/>
  <text x="450" y="318" fill="#648cb4" font-size="9" text-anchor="middle" font-weight="500">MTF10</text>
  <!-- Nyquist -->
  <line x1="520" y1="215" x2="520" y2="310" stroke="#8a8580" stroke-width="1" stroke-dasharray="3"/>
  <text x="520" y="213" fill="#8a8580" font-size="8" text-anchor="middle">Nyquist (0.5 c/p)</text>
</svg><div class="caption">圖 7-4：Slanted Edge MTF 量測法 — 從傾斜邊緣到 MTF 曲線的四步流程</div></div>

<h3>量測流程詳解</h3>
<ol>
  <li><strong>拍攝 Slanted Edge</strong>：邊緣傾斜約 5°（不要整數角度如 0° 或 45°）以利用 Sub-pixel 取樣</li>
  <li><strong>計算 ESF</strong>：將多行的像素投影到垂直邊緣的方向上，得到超取樣的 Edge Spread Function</li>
  <li><strong>求 LSF</strong>：對 ESF 做微分得到 Line Spread Function（即系統的一維 PSF）</li>
  <li><strong>FFT 得 MTF</strong>：對 LSF 做傅立葉轉換，取模值並正規化到 0 頻率為 1.0</li>
</ol>

<h3>關鍵指標</h3>
<table>
  <tr><th>指標</th><th>定義</th><th>意義</th></tr>
  <tr><td><strong>MTF50</strong></td><td>MTF = 0.5 的頻率</td><td>「銳度」的主要指標，與感知銳度高度相關</td></tr>
  <tr><td><strong>MTF10</strong></td><td>MTF = 0.1 的頻率</td><td>系統的極限解析力</td></tr>
  <tr><td><strong>MTF50P</strong></td><td>以 Picture Height 歸一化的 MTF50</td><td>不同解析度相機的公平比較</td></tr>
  <tr><td><strong>Nyquist MTF</strong></td><td>在 0.5 c/p 處的 MTF 值</td><td>Aliasing 風險評估</td></tr>
  <tr><td><strong>Overshoot</strong></td><td>邊緣 Overshoot 百分比</td><td>銳化過度的指標</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  MTF 量測反映的是「整個系統」的解析力，包含鏡頭、Sensor、ISP 所有處理的綜合效果。在 ISP Tuning 中，我們通常比較 RAW 域的 MTF（反映光學+Sensor）和最終輸出的 MTF（加上 ISP 處理），差值就是 ISP 銳化的貢獻。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  量測 MTF 時，建議在畫面中心和四角都放置 Slanted Edge，分別量測各區域的 MTF。中心和四角的 MTF 差異反映了鏡頭的 Field Curvature 和像差特性。ISP 可以透過空間自適應銳化來部分補償這個差異。
</div>
`,
      keyPoints: [
        "Slanted Edge 法是 ISO 12233 標準的 MTF 量測方法",
        "流程：拍攝傾斜邊緣 → ESF → 微分得 LSF → FFT 得 MTF",
        "MTF50 是銳度的主要指標，MTF10 代表極限解析力",
        "MTF 反映鏡頭 + Sensor + ISP 的綜合效果",
        "應量測中心和四角的 MTF 以評估全畫面一致性"
      ]
    },
    {
      id: "ch7_5",
      title: "色彩準確性 ΔE",
      content: `
<h3>什麼是 ΔE？</h3>
<p><strong>ΔE（Delta E）</strong>是量化兩個色彩之間「知覺差異」的指標。它在 CIE Lab 色彩空間中計算，因為 Lab 空間被設計為「知覺均勻」— 在 Lab 空間中相同的歐幾里得距離對應相似的知覺差異。</p>

<div class="formula">ΔE₀₀ = √[(ΔL'/kL·SL)² + (ΔC'/kC·SC)² + (ΔH'/kH·SH)² + RT·(ΔC'/kC·SC)·(ΔH'/kH·SH)]</div>

<p>上式是 CIEDE2000（ΔE00）的簡化表達。在實務中，有幾個版本的 ΔE 公式：</p>
<table>
  <tr><th>版本</th><th>年代</th><th>特點</th></tr>
  <tr><td>ΔE*ab (CIE76)</td><td>1976</td><td>最簡單的歐幾里得距離，但知覺均勻性不夠好</td></tr>
  <tr><td>ΔE*94 (CIE94)</td><td>1994</td><td>加入了亮度和彩度的加權</td></tr>
  <tr><td>ΔE00 (CIEDE2000)</td><td>2000</td><td>最準確，加入了旋轉項和更複雜的加權，業界標準</td></tr>
</table>

<h3>ΔE 的知覺含義</h3>
<table>
  <tr><th>ΔE00 值</th><th>知覺差異</th><th>IQ 評價</th></tr>
  <tr><td>0 ~ 1</td><td>幾乎不可察覺</td><td>優秀</td></tr>
  <tr><td>1 ~ 2</td><td>仔細比較可察覺</td><td>良好</td></tr>
  <tr><td>2 ~ 3.5</td><td>一般人可察覺</td><td>尚可</td></tr>
  <tr><td>3.5 ~ 5</td><td>明顯差異</td><td>需要改善</td></tr>
  <tr><td>&gt; 5</td><td>差異非常明顯</td><td>不可接受</td></tr>
</table>

<div class="diagram"><svg viewBox="0 0 650 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="300" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">ΔE 分布圖 — Macbeth 24-patch 量測結果</text>
  <!-- Bar chart -->
  <line x1="60" y1="40" x2="60" y2="240" stroke="#5a5550" stroke-width="1"/>
  <line x1="60" y1="240" x2="620" y2="240" stroke="#5a5550" stroke-width="1"/>
  <text x="50" y="60" fill="#8a8580" font-size="9" text-anchor="end">10</text>
  <text x="50" y="100" fill="#8a8580" font-size="9" text-anchor="end">8</text>
  <text x="50" y="140" fill="#8a8580" font-size="9" text-anchor="end">6</text>
  <text x="50" y="180" fill="#8a8580" font-size="9" text-anchor="end">4</text>
  <text x="50" y="200" fill="#8a8580" font-size="9" text-anchor="end">3</text>
  <text x="50" y="220" fill="#8a8580" font-size="9" text-anchor="end">2</text>
  <text x="50" y="240" fill="#8a8580" font-size="9" text-anchor="end">0</text>
  <text x="30" y="150" fill="#8a8580" font-size="10" text-anchor="middle" transform="rotate(-90,30,150)">ΔE00</text>
  <!-- Threshold lines -->
  <line x1="60" y1="200" x2="620" y2="200" stroke="#6a8a7a" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="622" y="198" fill="#6a8a7a" font-size="8">Good (ΔE≤3)</text>
  <line x1="60" y1="140" x2="620" y2="140" stroke="#c4a064" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="622" y="138" fill="#c4a064" font-size="8">Warn (ΔE=6)</text>
  <!-- Bars for 18 color patches (skip 6 grays) -->
  <rect x="72" y="190" width="20" height="50" rx="2" fill="#6a8a7a"/>
  <rect x="97" y="210" width="20" height="30" rx="2" fill="#6a8a7a"/>
  <rect x="122" y="185" width="20" height="55" rx="2" fill="#6a8a7a"/>
  <rect x="147" y="200" width="20" height="40" rx="2" fill="#6a8a7a"/>
  <rect x="172" y="175" width="20" height="65" rx="2" fill="#6a8a7a"/>
  <rect x="197" y="195" width="20" height="45" rx="2" fill="#6a8a7a"/>
  <rect x="222" y="160" width="20" height="80" rx="2" fill="#c4a064"/>
  <rect x="247" y="205" width="20" height="35" rx="2" fill="#6a8a7a"/>
  <rect x="272" y="170" width="20" height="70" rx="2" fill="#6a8a7a"/>
  <rect x="297" y="130" width="20" height="110" rx="2" fill="#c4a064"/>
  <rect x="322" y="188" width="20" height="52" rx="2" fill="#6a8a7a"/>
  <rect x="347" y="205" width="20" height="35" rx="2" fill="#6a8a7a"/>
  <rect x="372" y="215" width="20" height="25" rx="2" fill="#6a8a7a"/>
  <rect x="397" y="195" width="20" height="45" rx="2" fill="#6a8a7a"/>
  <rect x="422" y="178" width="20" height="62" rx="2" fill="#6a8a7a"/>
  <rect x="447" y="200" width="20" height="40" rx="2" fill="#6a8a7a"/>
  <rect x="472" y="210" width="20" height="30" rx="2" fill="#6a8a7a"/>
  <rect x="497" y="188" width="20" height="52" rx="2" fill="#6a8a7a"/>
  <!-- Summary stats -->
  <rect x="100" y="255" width="430" height="35" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="315" y="273" fill="#5a5550" font-size="11" text-anchor="middle">Mean ΔE00 = 2.8 | Max ΔE00 = 5.5 (Purple patch) | 16/18 patches ΔE < 3.5</text>
</svg><div class="caption">圖 7-5：ΔE 分布圖 — 18 個色塊的 ΔE00 值（綠色：良好 / 橘色：需注意）</div></div>

<h3>量測流程</h3>
<ol>
  <li>在 D65 標準光源下拍攝 Macbeth 24-patch 色卡</li>
  <li>使用自動化工具（如 Imatest）定位並擷取每個色塊的 ROI</li>
  <li>計算每個色塊的平均 RGB 值，轉換到 CIE Lab 空間</li>
  <li>與色卡的標準 Lab 值比較，計算每個色塊的 ΔE00</li>
  <li>統計 Mean ΔE、Max ΔE、各色塊分布</li>
</ol>

<h3>影響 ΔE 的 ISP 模組</h3>
<ul>
  <li><strong>White Balance</strong>：若 AWB 不準，灰色色塊的 ΔE 會偏高</li>
  <li><strong>CCM（Color Correction Matrix）</strong>：CCM 是色彩準確性的核心控制，直接影響所有色塊的 ΔE</li>
  <li><strong>Gamma/Tone Curve</strong>：影響亮度映射，間接影響 Lab 空間的 L 分量</li>
  <li><strong>Saturation</strong>：過度飽和會增加 ΔE</li>
  <li><strong>Lens Shading</strong>：若 LSC 不足，圖卡邊緣的色塊 ΔE 可能偏高</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  ΔE 追求的是色彩的「準確性」，但在消費性相機中，「好看」往往比「準確」更重要。許多手機相機故意讓天空更藍、草地更綠、膚色更暖，犧牲了 ΔE 數字來換取更討喜的視覺效果。這就是 IQ Tuning 中「科學」與「藝術」的平衡。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在評估膚色準確性時，不要只依賴 Macbeth 色卡的 Skin Tone patch。建議額外使用 Skin Tone Chart（如 X-Rite SG）或拍攝真人，因為膚色的微小偏差比一般色彩更容易被人眼察覺。特別是亞洲膚色（偏黃-橘），CCM 需要特別注意紅-黃方向的精準度。
</div>
`,
      keyPoints: [
        "ΔE 量化兩色之間的知覺差異，CIEDE2000 (ΔE00) 是業界標準",
        "ΔE00 < 1 幾乎不可察覺，> 5 差異非常明顯",
        "量測使用 Macbeth 色卡在 D65 光源下拍攝",
        "CCM 是色彩準確性的核心控制模組",
        "消費相機中「好看」可能比「準確」更重要 — 需要平衡"
      ]
    },
    {
      id: "ch7_6",
      title: "主觀 vs 客觀品質",
      content: `
<h3>客觀指標的局限性</h3>
<p>客觀指標（如 SNR、MTF、ΔE）雖然精確且可重現，但它們<strong>無法完全代表人眼的品質感知</strong>。一個典型的例子：強力降噪後再強力銳化，可以得到很好的 SNR 和 MTF50 數字，但影像可能呈現「蠟像般」的不自然質感。</p>

<p>這就是為什麼 IQ 評估必須同時結合<strong>客觀量測</strong>和<strong>主觀評價</strong>。</p>

<h3>主觀評價方法</h3>

<h4>1. MOS（Mean Opinion Score）</h4>
<p>最常用的主觀品質評估方法。邀請多名受試者（通常 15-30 人）對影像品質打分，取平均：</p>
<ul>
  <li>5 分：優秀（Excellent）</li>
  <li>4 分：好（Good）</li>
  <li>3 分：尚可（Fair）</li>
  <li>2 分：差（Poor）</li>
  <li>1 分：很差（Bad）</li>
</ul>

<h4>2. A/B 比較法</h4>
<p>同時展示兩張影像（不同參數設定），讓受試者選擇偏好的一張。簡單直觀，但需要大量的 pair 比較。</p>

<h4>3. JND（Just Noticeable Difference）</h4>
<p>逐步調整參數，找到受試者「剛好能察覺差異」的點。這個方法特別適合確定參數的「安全範圍」。</p>

<div class="diagram"><svg viewBox="0 0 650 310" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="310" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">主觀與客觀品質的相關性</text>
  <!-- Axes -->
  <line x1="80" y1="50" x2="80" y2="260" stroke="#5a5550" stroke-width="1.2"/>
  <line x1="80" y1="260" x2="580" y2="260" stroke="#5a5550" stroke-width="1.2"/>
  <text x="55" y="155" fill="#8a8580" font-size="11" text-anchor="middle" transform="rotate(-90,55,155)">主觀品質 (MOS)</text>
  <text x="330" y="285" fill="#8a8580" font-size="11" text-anchor="middle">客觀指標 (e.g. PSNR, SSIM)</text>
  <!-- Y labels -->
  <text x="72" y="75" fill="#8a8580" font-size="9" text-anchor="end">5</text>
  <text x="72" y="122" fill="#8a8580" font-size="9" text-anchor="end">4</text>
  <text x="72" y="169" fill="#8a8580" font-size="9" text-anchor="end">3</text>
  <text x="72" y="216" fill="#8a8580" font-size="9" text-anchor="end">2</text>
  <text x="72" y="260" fill="#8a8580" font-size="9" text-anchor="end">1</text>
  <!-- Scatter points (showing imperfect correlation) -->
  <circle cx="130" cy="230" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="160" cy="210" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="180" cy="220" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="210" cy="185" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="240" cy="170" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="260" cy="145" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="280" cy="160" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="310" cy="130" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="330" cy="115" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="350" cy="140" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="380" cy="105" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="400" cy="95" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="430" cy="100" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="460" cy="85" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="490" cy="80" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="520" cy="90" r="5" fill="#6a8a7a" opacity="0.6"/>
  <!-- Outliers (where subjective != objective) -->
  <circle cx="420" cy="170" r="6" fill="#c4a064" opacity="0.8" stroke="#c4a064" stroke-width="1.5"/>
  <text x="430" y="183" fill="#c4a064" font-size="8">Over-processed</text>
  <circle cx="200" cy="130" r="6" fill="#648cb4" opacity="0.8" stroke="#648cb4" stroke-width="1.5"/>
  <text x="210" y="123" fill="#648cb4" font-size="8">Natural feel</text>
  <!-- Trend line -->
  <path d="M110,240 Q300,155 540,80" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="6,3"/>
  <!-- Annotations -->
  <rect x="120" y="290" width="200" height="15" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="220" y="300" fill="#c4a064" font-size="9" text-anchor="middle">高客觀分但主觀差 = 過度處理</text>
  <rect x="350" y="290" width="200" height="15" rx="3" fill="rgba(100,140,180,0.15)"/>
  <text x="450" y="300" fill="#648cb4" font-size="9" text-anchor="middle">低客觀分但主觀好 = 自然質感</text>
</svg><div class="caption">圖 7-6：主觀品質（MOS）與客觀指標的相關性 — 存在離群點</div></div>

<h3>不一致的常見原因</h3>
<table>
  <tr><th>情況</th><th>客觀表現</th><th>主觀感受</th><th>原因</th></tr>
  <tr><td>強 NR + 強銳化</td><td>SNR↑ MTF50↑</td><td>「蠟像感」不自然</td><td>紋理被破壞後人工重建</td></tr>
  <tr><td>輕微噪聲保留</td><td>SNR↓</td><td>感覺更自然</td><td>Film Grain 般的噪聲反而增加質感</td></tr>
  <tr><td>過度飽和</td><td>ΔE↑（差）</td><td>某些場景更討喜</td><td>鮮豔色彩的偏好勝過準確性</td></tr>
  <tr><td>銳度適中</td><td>MTF50 普通</td><td>「剛好」的清晰感</td><td>沒有 Overshoot 的自然銳度</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  客觀指標是 IQ Tuning 的<strong>必要條件</strong>，但不是<strong>充分條件</strong>。一個好的 IQ Tuning 結果必須同時達到合理的客觀指標<strong>和</strong>良好的主觀感受。當兩者衝突時，通常以主觀感受為準 — 因為最終用戶看到的是影像，不是數字。
</div>

<h3>進階客觀指標</h3>
<p>為了更好地預測主觀品質，學術界開發了多種「知覺品質指標」：</p>
<ul>
  <li><strong>SSIM（Structural Similarity）</strong>：考慮了結構資訊，比 PSNR 更符合人眼感知</li>
  <li><strong>VMAF（Video Multimethod Assessment Fusion）</strong>：Netflix 開發的融合多指標的品質預測模型</li>
  <li><strong>LPIPS（Learned Perceptual Image Patch Similarity）</strong>：基於深度學習的知覺相似度</li>
  <li><strong>NIQE / BRISQUE</strong>：無參考（No-Reference）品質指標，不需要原始影像</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議在 IQ Tuning 流程中設立兩道關卡：(1) 客觀指標門檻 — 必須通過最低標準；(2) 主觀盲測 — 由不知道參數設定的人員進行 A/B 比較。這兩道關卡都通過才算調適完成。
</div>
`,
      keyPoints: [
        "客觀指標無法完全代表人眼的品質感知",
        "主觀評價方法包括 MOS 評分、A/B 比較、JND 測試",
        "主觀與客觀不一致的常見原因：過度處理、自然質感偏好",
        "進階指標如 SSIM、VMAF、LPIPS 更接近人眼感知",
        "IQ Tuning 應設立客觀門檻和主觀盲測的雙重關卡"
      ]
    },
    {
      id: "ch7_7",
      title: "IQ Trade-offs",
      content: `
<h3>影像品質的不可能三角</h3>
<p>在 ISP Tuning 中，存在一個根本性的矛盾：你不可能同時將<strong>銳度（Detail/Sharpness）</strong>、<strong>乾淨度（Noise）</strong>、和<strong>自然度（Artifact-free）</strong>三者都推到極致。提升其中一個維度，幾乎必然會犧牲另外一個或兩個維度。</p>

<div class="diagram"><svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="380" fill="#f5f0eb" rx="8"/>
  <text x="300" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">IQ Trade-off 三角</text>
  <!-- Triangle -->
  <polygon points="300,55 90,310 510,310" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- Vertices -->
  <circle cx="300" cy="55" r="30" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="2"/>
  <text x="300" y="52" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="600">Detail</text>
  <text x="300" y="66" fill="#6a8a7a" font-size="9" text-anchor="middle">銳度/細節</text>
  <circle cx="90" cy="310" r="30" fill="rgba(100,140,180,0.2)" stroke="#648cb4" stroke-width="2"/>
  <text x="90" y="307" fill="#648cb4" font-size="11" text-anchor="middle" font-weight="600">Clean</text>
  <text x="90" y="321" fill="#648cb4" font-size="9" text-anchor="middle">乾淨/低噪聲</text>
  <circle cx="510" cy="310" r="30" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="2"/>
  <text x="510" y="307" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="600">Natural</text>
  <text x="510" y="321" fill="#c4a064" font-size="9" text-anchor="middle">自然/無偽影</text>
  <!-- Edge labels -->
  <text x="170" y="170" fill="#5a5550" font-size="10" text-anchor="middle" transform="rotate(-60,170,170)">銳化放大噪聲</text>
  <text x="430" y="170" fill="#5a5550" font-size="10" text-anchor="middle" transform="rotate(60,430,170)">銳化產生 Halo</text>
  <text x="300" y="330" fill="#5a5550" font-size="10" text-anchor="middle">降噪損失紋理</text>
  <!-- Operating points -->
  <circle cx="250" cy="180" r="8" fill="#6a8a7a" stroke="#fff" stroke-width="2"/>
  <text x="220" y="178" fill="#6a8a7a" font-size="9" text-anchor="end">手機</text>
  <circle cx="350" cy="200" r="8" fill="#c4a064" stroke="#fff" stroke-width="2"/>
  <text x="380" y="198" fill="#c4a064" font-size="9">車用</text>
  <circle cx="300" cy="230" r="8" fill="#648cb4" stroke="#fff" stroke-width="2"/>
  <text x="330" y="226" fill="#648cb4" font-size="9">專業</text>
  <!-- Center label -->
  <text x="300" y="265" fill="#8a8580" font-size="10" text-anchor="middle" font-style="italic">「理想」= 三者完美平衡</text>
  <text x="300" y="280" fill="#8a8580" font-size="9" text-anchor="middle">但實際上必須根據應用做取捨</text>
  <!-- Legend -->
  <rect x="120" y="350" width="360" height="22" rx="4" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <circle cx="160" cy="361" r="5" fill="#6a8a7a"/>
  <text x="170" y="365" fill="#5a5550" font-size="9">手機（偏銳利）</text>
  <circle cx="290" cy="361" r="5" fill="#c4a064"/>
  <text x="300" y="365" fill="#5a5550" font-size="9">車用（偏自然）</text>
  <circle cx="400" cy="361" r="5" fill="#648cb4"/>
  <text x="410" y="365" fill="#5a5550" font-size="9">專業（平衡）</text>
</svg><div class="caption">圖 7-7：IQ Trade-off 三角 — Detail / Clean / Natural 的平衡取捨</div></div>

<h3>主要的 Trade-off 對</h3>

<h4>1. 銳度 vs 噪聲</h4>
<p>這是最核心的 Trade-off。銳化增強高頻 → 噪聲被放大；降噪壓制高頻 → 紋理被破壞。兩者的平衡點取決於 ISO（SNR）。</p>

<h4>2. 降噪強度 vs 紋理保留</h4>
<p>降噪越強，平坦區越乾淨，但紋理（如草地、布料）越模糊。「塗抹感」（Smearing）是過度降噪的典型 artifact。</p>

<h4>3. 銳度 vs Artifact（Halo/Ringing）</h4>
<p>銳化越強，邊緣越清晰，但 Overshoot/Undershoot（Halo）越明顯。特別是在高對比度邊緣處。</p>

<h4>4. Dynamic Range vs 噪聲</h4>
<p>HDR 合成擴大了動態範圍，但在暗區提亮時會放大噪聲；在亮區壓暗時可能降低 SNR。</p>

<h4>5. 色彩準確性 vs 色彩偏好</h4>
<p>精確的色彩（低 ΔE）不一定是最討喜的。消費者通常偏好更鮮豔的天空、更紅潤的膚色。</p>

<h3>不同應用場景的取捨策略</h3>
<table>
  <tr><th>應用</th><th>優先級排序</th><th>說明</th></tr>
  <tr><td>手機社交分享</td><td>銳度 > 色彩討喜 > 乾淨</td><td>小螢幕觀看，銳度和色彩更重要</td></tr>
  <tr><td>專業攝影</td><td>自然度 > 細節 > 準確色彩</td><td>後期空間大，不希望過度處理</td></tr>
  <tr><td>車用 ADAS</td><td>自然度 > 動態範圍 > 銳度</td><td>不能有 artifact 影響演算法判斷</td></tr>
  <tr><td>監控</td><td>乾淨 > 動態範圍 > 細節</td><td>低光下辨識能力最重要</td></tr>
  <tr><td>醫療影像</td><td>準確色彩 > 自然度 > 細節</td><td>診斷準確性為最高優先</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  IQ Tuning 的本質是<strong>在有限的物理條件下做最佳的取捨</strong>。沒有「萬能」的參數設定，只有「最適合特定應用和場景」的設定。好的 Tuning 工程師不只是調參數的技術人員，更是理解應用需求的「品質策略師」。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在項目初期就與客戶明確「IQ Priority」（品質優先級排序），並用參考影像（Golden Reference）達成共識。這可以避免後期無止境的修改循環。一個有效的方法是提供 3~4 組不同取捨策略的樣張，讓客戶選擇偏好的方向。
</div>
`,
      keyPoints: [
        "Detail、Clean、Natural 三者構成不可能三角",
        "核心 Trade-off：銳度 vs 噪聲、降噪 vs 紋理、銳化 vs Halo",
        "不同應用有不同的優先級排序",
        "好的 Tuning 是在物理限制下做最佳取捨，沒有萬能設定",
        "項目初期應與客戶明確 IQ Priority 和 Golden Reference"
      ]
    },
    {
      id: "ch7_8",
      title: "場景調適策略 Scene-adaptive Tuning",
      content: `
<h3>為什麼需要場景調適？</h3>
<p>不同的拍攝場景有截然不同的特性和品質需求。例如：夜景需要更強的降噪但要保留燈光細節；人像需要柔和的皮膚但清晰的五官；風景需要豐富的紋理和鮮豔的色彩。如果用同一組 ISP 參數處理所有場景，必然無法在每個場景都達到最佳效果。</p>

<p><strong>場景調適（Scene-adaptive Tuning）</strong>就是根據自動辨識的場景類型，動態切換或調整 ISP 參數。</p>

<div class="diagram"><svg viewBox="0 0 650 370" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="370" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">場景分類與調適流程</text>
  <defs><marker id="arrowSC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Input -->
  <rect x="30" y="50" width="100" height="60" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="80" y="77" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">輸入影像</text>
  <text x="80" y="95" fill="#8a8580" font-size="9" text-anchor="middle">RAW / YUV</text>
  <line x1="130" y1="80" x2="165" y2="80" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowSC)"/>
  <!-- Scene Classifier -->
  <rect x="170" y="40" width="140" height="80" rx="8" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="240" y="65" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Scene Classifier</text>
  <text x="240" y="82" fill="#5a5550" font-size="9" text-anchor="middle">亮度 / 色溫 / 紋理</text>
  <text x="240" y="96" fill="#5a5550" font-size="9" text-anchor="middle">人臉 / 動態 / 天空佔比</text>
  <text x="240" y="108" fill="#8a8580" font-size="8" text-anchor="middle">（規則或 AI 模型）</text>
  <!-- Scene types -->
  <line x1="310" y1="60" x2="370" y2="50" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="310" y1="75" x2="370" y2="90" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="310" y1="90" x2="370" y2="130" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="310" y1="105" x2="370" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <!-- Scene boxes -->
  <rect x="375" y="35" width="115" height="30" rx="5" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="432" y="55" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">🌙 夜景 Night</text>
  <rect x="375" y="75" width="115" height="30" rx="5" fill="rgba(200,120,120,0.12)" stroke="#c87878" stroke-width="1.2"/>
  <text x="432" y="95" fill="#c87878" font-size="10" text-anchor="middle" font-weight="500">👤 人像 Portrait</text>
  <rect x="375" y="115" width="115" height="30" rx="5" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="432" y="135" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">🏔️ 風景 Landscape</text>
  <rect x="375" y="155" width="115" height="30" rx="5" fill="rgba(100,140,180,0.12)" stroke="#648cb4" stroke-width="1.2"/>
  <text x="432" y="175" fill="#648cb4" font-size="10" text-anchor="middle" font-weight="500">📝 文件 Document</text>
  <!-- Per-scene parameters -->
  <line x1="490" y1="50" x2="520" y2="50" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="490" y1="90" x2="520" y2="90" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="490" y1="130" x2="520" y2="130" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="490" y1="170" x2="520" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <rect x="525" y="30" width="105" height="165" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="577" y="50" fill="#c4a064" font-size="9" text-anchor="middle">NR↑ Sharp↓</text>
  <text x="577" y="65" fill="#c4a064" font-size="8" text-anchor="middle">HDR=ON Sat↓</text>
  <text x="577" y="93" fill="#c87878" font-size="9" text-anchor="middle">SkinNR↑ Eye↑</text>
  <text x="577" y="108" fill="#c87878" font-size="8" text-anchor="middle">Bokeh WB暖</text>
  <text x="577" y="135" fill="#6a8a7a" font-size="9" text-anchor="middle">Sharp↑ Sat↑</text>
  <text x="577" y="150" fill="#6a8a7a" font-size="8" text-anchor="middle">Clarity↑ Sky↑</text>
  <text x="577" y="175" fill="#648cb4" font-size="9" text-anchor="middle">Sharp MAX</text>
  <text x="577" y="190" fill="#648cb4" font-size="8" text-anchor="middle">Contrast↑ BW</text>
  <!-- Blending -->
  <rect x="130" y="225" width="400" height="55" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="330" y="248" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Parameter Blending / Interpolation</text>
  <text x="330" y="268" fill="#5a5550" font-size="10" text-anchor="middle">多場景混合時使用加權插值，確保參數切換不會產生可見跳變</text>
  <!-- Smooth transition note -->
  <rect x="100" y="300" width="450" height="55" rx="6" fill="rgba(196,160,100,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="318" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">關鍵挑戰：場景轉換時的平滑過渡</text>
  <text x="325" y="338" fill="#8a8580" font-size="10" text-anchor="middle">連續影像中場景變化時，參數需要逐幀漸變（Temporal Smoothing）</text>
  <text x="325" y="352" fill="#8a8580" font-size="10" text-anchor="middle">避免相鄰幀之間出現突兀的亮度、色彩或銳度跳變</text>
</svg><div class="caption">圖 7-8：場景分類與 Per-scene 調適流程</div></div>

<h3>常見場景及其調適策略</h3>
<table>
  <tr><th>場景</th><th>特徵</th><th>NR</th><th>銳化</th><th>色彩</th><th>其他</th></tr>
  <tr><td>夜景</td><td>低光、高 ISO</td><td>強</td><td>弱</td><td>低飽和</td><td>HDR merge、長曝</td></tr>
  <tr><td>人像</td><td>有人臉</td><td>皮膚區強 NR</td><td>眼/唇強化</td><td>膚色暖調</td><td>Bokeh、美顏</td></tr>
  <tr><td>風景</td><td>遠景、天空多</td><td>中等</td><td>強</td><td>高飽和</td><td>Clarity↑、天空增強</td></tr>
  <tr><td>文件</td><td>文字/圖表</td><td>極弱</td><td>極強</td><td>低飽和</td><td>高對比度、二值化</td></tr>
  <tr><td>逆光</td><td>高 DR 場景</td><td>中等</td><td>中等</td><td>標準</td><td>HDR、LTM 增強</td></tr>
  <tr><td>動態</td><td>快速移動</td><td>時域 NR 關閉</td><td>中等</td><td>標準</td><td>短曝光、防手震</td></tr>
</table>

<h3>場景分類技術</h3>
<p>場景分類可以使用規則式或 AI 式方法：</p>
<ul>
  <li><strong>規則式</strong>：根據曝光參數（ISO、曝光時間）、AWB 色溫、人臉偵測結果、3A 統計資訊等，用手動設定的規則來判斷場景。簡單可靠但不夠精細</li>
  <li><strong>AI 式</strong>：使用輕量級的 CNN 或 Decision Tree 模型，從影像特徵自動分類場景。更精確但需要訓練數據和計算資源</li>
  <li><strong>混合式</strong>：AI 模型輔助 + 規則兜底，是目前主流的做法</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  場景調適的關鍵挑戰不在於「分類正確」，而在於「過渡平滑」。在錄影模式下，場景可能在幾幀內快速變化（例如從室內走到室外），如果參數瞬間切換，用戶會看到明顯的跳變。因此，所有場景自適應參數都需要<strong>時間域平滑（Temporal Smoothing）</strong>。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  設計場景調適時，建議使用「Base + Delta」的架構：先有一組在所有場景都「還不錯」的基礎參數（Base），然後每個場景只定義相對於 Base 的調整量（Delta）。這樣管理起來更清晰，也更容易做場景間的混合插值。
</div>
`,
      keyPoints: [
        "不同場景有不同的 IQ 需求，需要動態調整 ISP 參數",
        "常見場景：夜景、人像、風景、文件、逆光、動態",
        "場景分類使用規則式、AI 式或混合式方法",
        "關鍵挑戰是場景轉換時的平滑過渡（Temporal Smoothing）",
        "建議使用 Base + Delta 架構管理 Per-scene 參數"
      ]
    },
    {
      id: "ch7_9",
      title: "車用相機 IQ 要求",
      content: `
<h3>車用相機的特殊需求</h3>
<p><strong>車用相機（Automotive Camera）</strong>的 IQ 要求與消費性相機有本質的不同。消費相機的目標是「讓人看了覺得好看」，而車用相機的目標是「讓演算法能正確識別」— 無論是 ADAS（Advanced Driver Assistance Systems）還是自動駕駛系統。</p>

<p>這意味著車用 IQ Tuning 的首要原則是：<strong>不能引入會誤導感知演算法的 artifact</strong>。</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="#f5f0eb" rx="8"/>
  <text x="300" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">車用相機 IQ 需求雷達圖</text>
  <!-- Radar chart -->
  <g transform="translate(300,190)">
    <!-- Axes (6 dimensions) -->
    <line x1="0" y1="0" x2="0" y2="-130" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="112" y2="-65" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="112" y2="65" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="0" y2="130" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="-112" y2="65" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="-112" y2="-65" stroke="#d5cec7" stroke-width="1"/>
    <!-- Grid rings -->
    <polygon points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" fill="none" stroke="#d5cec7" stroke-width="0.5"/>
    <polygon points="0,-91 79,-45 79,45 0,91 -79,45 -79,-45" fill="none" stroke="#d5cec7" stroke-width="0.5"/>
    <polygon points="0,-130 112,-65 112,65 0,130 -112,65 -112,-65" fill="none" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Labels -->
    <text x="0" y="-140" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">Dynamic Range</text>
    <text x="130" y="-68" fill="#5a5550" font-size="11" font-weight="500">LED Flicker</text>
    <text x="130" y="75" fill="#5a5550" font-size="11" font-weight="500">Low-light SNR</text>
    <text x="0" y="148" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">色彩一致性</text>
    <text x="-130" y="75" fill="#5a5550" font-size="11" text-anchor="end" font-weight="500">Artifact-free</text>
    <text x="-130" y="-68" fill="#5a5550" font-size="11" text-anchor="end" font-weight="500">MTF 均勻性</text>
    <!-- Consumer camera profile -->
    <polygon points="0,-78 90,-35 67,50 0,65 -56,35 -90,-45" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
    <!-- Automotive camera profile -->
    <polygon points="0,-117 101,-55 90,55 0,104 -101,55 -101,-52" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="2"/>
  </g>
  <!-- Legend -->
  <line x1="140" y1="340" x2="170" y2="340" stroke="#6a8a7a" stroke-width="2"/>
  <text x="175" y="344" fill="#5a5550" font-size="10">車用相機要求</text>
  <line x1="310" y1="340" x2="340" y2="340" stroke="#c4a064" stroke-width="1.5"/>
  <text x="345" y="344" fill="#5a5550" font-size="10">消費相機要求</text>
</svg><div class="caption">圖 7-9：車用 vs 消費相機 IQ 需求雷達圖 — 車用在多個維度要求更高</div></div>

<h3>關鍵需求分析</h3>

<h4>1. 超高動態範圍（HDR）</h4>
<p>車用場景的動態範圍需求遠超消費相機：</p>
<ul>
  <li>隧道出口：暗處需要看到路面，亮處需要看到天空和對向車輛（> 120 dB）</li>
  <li>夜間逆光：對向車燈 + 陰暗路面（> 100 dB）</li>
  <li>車用 Sensor 通常使用 Split-pixel HDR 或 Multi-exposure HDR 來達到 120+ dB</li>
</ul>

<h4>2. LED Flicker Mitigation（LED 閃爍抑制）</h4>
<p>LED 交通號誌和 LED 車燈以高頻脈衝方式驅動。如果曝光時間不是 LED 週期的整數倍，拍攝到的影像會出現 LED 部分暗或完全不亮的現象，這可能導致 ADAS 系統<strong>無法辨識紅綠燈狀態</strong>— 這是安全攸關的問題。</p>

<h4>3. Artifact-free 處理</h4>
<p>車用 ISP 對 Artifact 的容忍度極低：</p>
<ul>
  <li>Halo / Ringing：可能被物件偵測網路誤判為物體邊緣</li>
  <li>Color Fringing：可能影響交通號誌的色彩判讀</li>
  <li>Motion Artifact：HDR 合成時的鬼影可能被誤判為行人</li>
</ul>

<h4>4. 溫度穩定性</h4>
<p>車用相機需要在 -40°C ~ +85°C 的範圍內保持穩定的 IQ。Sensor 的噪聲特性和 Dark Current 會隨溫度大幅變化，ISP 參數需要有溫度補償機制。</p>

<h3>車用 IQ 標準</h3>
<table>
  <tr><th>標準/規範</th><th>涵蓋範圍</th></tr>
  <tr><td>IEEE 2020</td><td>車用影像品質評估標準</td></tr>
  <tr><td>AIS (Automotive Image Standard)</td><td>車用相機性能指標定義</td></tr>
  <tr><td>ISO 16505</td><td>電子後視鏡的影像品質要求</td></tr>
  <tr><td>NCAP 評分</td><td>ADAS 系統的安全性評估（間接影響 IQ 要求）</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  車用相機的 IQ Tuning 首要原則是「安全第一」— 任何 ISP 處理都不能引入可能誤導 ADAS 演算法的 artifact。這與消費相機「好看第一」的原則完全不同。在車用 IQ 中，保守、穩定的處理往往優於激進、華麗的效果。
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 安全注意</div>
  車用 ISP 的 Tuning 錯誤可能導致嚴重後果。例如：過度降噪導致行人在低光下被「抹除」；HDR 合成的鬼影被誤判為障礙物導致急剎車。車用 IQ Tuning 必須經過嚴格的場景覆蓋測試和安全審查。
</div>
`,
      keyPoints: [
        "車用 IQ 的首要原則是「安全第一」— 不能引入誤導演算法的 artifact",
        "超高 HDR（>120dB）是核心需求，隧道和夜間逆光場景",
        "LED Flicker 抑制是安全攸關的問題（交通號誌辨識）",
        "對 Halo、Color Fringing、Motion Artifact 的容忍度極低",
        "需要在 -40°C~+85°C 範圍內保持穩定 IQ"
      ]
    },
    {
      id: "ch7_10",
      title: "IQ Tuning 工具與流程",
      content: `
<h3>IQ Tuning 工具鏈</h3>
<p>完整的 IQ Tuning 工作需要一系列的軟硬體工具。從拍攝環境到分析軟體，每個環節都有專門的工具。</p>

<div class="diagram"><svg viewBox="0 0 650 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="380" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">IQ Tuning 完整工具鏈</text>
  <defs><marker id="arrowTL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Layer 1: Environment -->
  <rect x="25" y="42" width="600" height="55" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="55" y="62" fill="#c4a064" font-size="11" font-weight="500">拍攝環境</text>
  <rect x="55" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="97" y="85" fill="#5a5550" font-size="9" text-anchor="middle">光箱 Light Box</text>
  <rect x="150" y="70" width="90" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="195" y="85" fill="#5a5550" font-size="9" text-anchor="middle">色溫可調光源</text>
  <rect x="250" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="292" y="85" fill="#5a5550" font-size="9" text-anchor="middle">Spectrometer</text>
  <rect x="345" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="387" y="85" fill="#5a5550" font-size="9" text-anchor="middle">Lux Meter</text>
  <rect x="440" y="70" width="75" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="477" y="85" fill="#5a5550" font-size="9" text-anchor="middle">測試圖卡</text>
  <rect x="525" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="567" y="85" fill="#5a5550" font-size="9" text-anchor="middle">Integrating Sphere</text>
  <line x1="325" y1="97" x2="325" y2="112" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowTL)"/>
  <!-- Layer 2: Capture -->
  <rect x="25" y="115" width="600" height="55" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="55" y="135" fill="#6a8a7a" font-size="11" font-weight="500">影像擷取</text>
  <rect x="55" y="143" width="110" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="110" y="158" fill="#5a5550" font-size="9" text-anchor="middle">RAW Capture Tool</text>
  <rect x="175" y="143" width="110" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="230" y="158" fill="#5a5550" font-size="9" text-anchor="middle">Vendor ISP Tool</text>
  <rect x="295" y="143" width="120" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="355" y="158" fill="#5a5550" font-size="9" text-anchor="middle">Register Read/Write</text>
  <rect x="425" y="143" width="100" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="475" y="158" fill="#5a5550" font-size="9" text-anchor="middle">ADB / UART</text>
  <line x1="325" y1="170" x2="325" y2="185" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowTL)"/>
  <!-- Layer 3: Tuning -->
  <rect x="25" y="188" width="600" height="55" rx="6" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1.2"/>
  <text x="55" y="208" fill="#648cb4" font-size="11" font-weight="500">參數調適</text>
  <rect x="55" y="216" width="120" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="115" y="231" fill="#5a5550" font-size="9" text-anchor="middle">ISP Tuning GUI</text>
  <rect x="185" y="216" width="100" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="235" y="231" fill="#5a5550" font-size="9" text-anchor="middle">XML/JSON 參數</text>
  <rect x="295" y="216" width="110" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="350" y="231" fill="#5a5550" font-size="9" text-anchor="middle">自動校準腳本</text>
  <rect x="415" y="216" width="95" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="462" y="231" fill="#5a5550" font-size="9" text-anchor="middle">版本管理 Git</text>
  <rect x="520" y="216" width="90" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="565" y="231" fill="#5a5550" font-size="9" text-anchor="middle">即時預覽</text>
  <line x1="325" y1="243" x2="325" y2="258" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowTL)"/>
  <!-- Layer 4: Analysis -->
  <rect x="25" y="261" width="600" height="55" rx="6" fill="rgba(160,130,180,0.08)" stroke="#a082b4" stroke-width="1.2"/>
  <text x="55" y="281" fill="#a082b4" font-size="11" font-weight="500">分析評估</text>
  <rect x="55" y="289" width="80" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="95" y="304" fill="#5a5550" font-size="9" text-anchor="middle">Imatest</text>
  <rect x="145" y="289" width="95" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="192" y="304" fill="#5a5550" font-size="9" text-anchor="middle">DxO Analyzer</text>
  <rect x="250" y="289" width="75" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="287" y="304" fill="#5a5550" font-size="9" text-anchor="middle">MATLAB</text>
  <rect x="335" y="289" width="75" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="372" y="304" fill="#5a5550" font-size="9" text-anchor="middle">Python</text>
  <rect x="420" y="289" width="95" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="467" y="304" fill="#5a5550" font-size="9" text-anchor="middle">自動化報告</text>
  <rect x="525" y="289" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="567" y="304" fill="#5a5550" font-size="9" text-anchor="middle">主觀評價 App</text>
  <!-- Feedback loop -->
  <path d="M625,280 Q640,200 625,130 Q620,115 600,115" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrowTL)"/>
  <text x="640" y="200" fill="#6a8a7a" font-size="9" transform="rotate(90,640,200)">迭代回饋</text>
  <!-- Bottom summary -->
  <rect x="80" y="335" width="490" height="35" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="350" fill="#5a5550" font-size="10" text-anchor="middle">完整的工具鏈實現：拍攝 → 擷取 RAW → 調參 → 即時預覽 → 客觀量測 → 主觀評估 → 迭代</text>
  <text x="325" y="365" fill="#8a8580" font-size="9" text-anchor="middle">自動化程度越高，Tuning 效率越高。目標：每次迭代 < 1 小時</text>
</svg><div class="caption">圖 7-10：IQ Tuning 完整工具鏈 — 從拍攝環境到分析評估的四層架構</div></div>

<h3>商業 IQ 分析工具</h3>
<table>
  <tr><th>工具</th><th>特色</th><th>主要用途</th></tr>
  <tr><td><strong>Imatest</strong></td><td>業界最廣泛使用，支援多種圖卡</td><td>MTF、色彩、噪聲、畸變等全方位評估</td></tr>
  <tr><td><strong>DxO Analyzer</strong></td><td>DxOMark 評分背後的工具</td><td>標準化的 IQ Benchmarking</td></tr>
  <tr><td><strong>Image Engineering</strong></td><td>德國精密量測</td><td>高精度色彩和解析力量測</td></tr>
  <tr><td><strong>HGH ADAS Test</strong></td><td>車用專用</td><td>LED Flicker、HDR、車用場景</td></tr>
</table>

<h3>自動化 Tuning 趨勢</h3>
<p>傳統的 IQ Tuning 高度依賴工程師的經驗和手動調整，效率低且難以規模化。現代趨勢是引入<strong>自動化 Tuning</strong>：</p>
<ul>
  <li><strong>Auto-calibration</strong>：BLC、LSC、DPC 等校準步驟完全自動化（已成熟）</li>
  <li><strong>Guided Tuning</strong>：工具提供建議值和自動搜尋最佳參數的功能</li>
  <li><strong>ML-based Tuning</strong>：使用機器學習模型預測最佳 ISP 參數（研究前沿）</li>
  <li><strong>CI/CD Pipeline</strong>：將 IQ 評估整合到持續整合流程中，每次軟體更新自動跑 IQ Regression Test</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  IQ Tuning 工具鏈的成熟度直接影響開發效率。一個好的工具鏈能讓「拍攝→調參→驗證」的單次迭代控制在 1 小時以內，而非手動操作時的半天到一天。投資建設自動化工具鏈，在多項目、多產品的環境中回報極高。
</div>

<h3>版本管理與追溯</h3>
<p>ISP 參數的版本管理非常重要：</p>
<ul>
  <li>使用 Git 管理所有參數檔案（XML、JSON、Binary）</li>
  <li>每次調整附帶變更說明和效果對比截圖</li>
  <li>維護 IQ Regression Test Suite — 一組標準場景影像和期望的品質指標</li>
  <li>在 CI/CD 中自動執行 Regression Test，防止品質回退</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議建立一個「IQ Dashboard」— 一個集中顯示所有 IQ 指標歷史趨勢的網頁或工具。這樣團隊成員可以隨時追蹤 IQ 的變化趨勢，快速發現品質回退，並將 IQ 狀態可視化地呈現給管理層和客戶。
</div>
`,
      keyPoints: [
        "完整工具鏈包含拍攝環境、影像擷取、參數調適、分析評估四層",
        "Imatest 和 DxO Analyzer 是業界最主流的商業 IQ 分析工具",
        "自動化 Tuning 是趨勢：Auto-calibration → Guided → ML-based",
        "使用 Git 管理參數版本，CI/CD 整合 IQ Regression Test",
        "投資自動化工具鏈在多項目環境中回報極高"
      ]
    },
    {
      id: "ch7_11",
      title: "IQ 自動化測試框架",
      content: `
<h3>為什麼需要自動化 IQ 測試？</h3>
<p>在現代 ISP 開發流程中，每次韌體更新、參數調整或演算法修改後，都需要驗證 IQ 是否發生回退。如果依靠人工拍攝和比對，不僅耗時耗力，還容易因<strong>主觀判斷差異</strong>而遺漏問題。<strong>IQ 自動化測試框架（Automated IQ Test Framework）</strong>的目標就是將「拍攝 → 分析 → 判定」這個迴圈完全自動化，讓 IQ 驗證能像軟體單元測試一樣頻繁、可靠地執行。</p>

<p>一個成熟的自動化 IQ 測試框架通常包含四大模組：<strong>Capture Automation</strong>（自動拍攝）、<strong>Metric Extraction Pipeline</strong>（指標萃取）、<strong>Regression Testing</strong>（回歸測試）和 <strong>CI/CD Integration</strong>（持續整合）。</p>

<div class="diagram"><svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="360" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">IQ 自動化測試框架架構</text>
  <defs>
    <marker id="aqArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
  </defs>
  <!-- Capture -->
  <rect x="30" y="45" width="120" height="80" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="90" y="65" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">Capture</text>
  <text x="90" y="80" fill="#5a5550" font-size="9" text-anchor="middle">ADB / UART 控制</text>
  <text x="90" y="93" fill="#5a5550" font-size="9" text-anchor="middle">自動拍攝腳本</text>
  <text x="90" y="106" fill="#5a5550" font-size="9" text-anchor="middle">RAW + YUV 儲存</text>
  <line x1="150" y1="85" x2="180" y2="85" stroke="#5a5550" stroke-width="1.2" marker-end="url(#aqArr)"/>
  <!-- Extraction -->
  <rect x="185" y="45" width="130" height="80" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="250" y="65" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Metric Extraction</text>
  <text x="250" y="80" fill="#5a5550" font-size="9" text-anchor="middle">SNR / Sharpness</text>
  <text x="250" y="93" fill="#5a5550" font-size="9" text-anchor="middle">Color Accuracy</text>
  <text x="250" y="106" fill="#5a5550" font-size="9" text-anchor="middle">Dynamic Range</text>
  <line x1="315" y1="85" x2="345" y2="85" stroke="#5a5550" stroke-width="1.2" marker-end="url(#aqArr)"/>
  <!-- Regression -->
  <rect x="350" y="45" width="110" height="80" rx="6" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="405" y="65" fill="#4a7ab5" font-size="11" text-anchor="middle" font-weight="500">Regression</text>
  <text x="405" y="80" fill="#5a5550" font-size="9" text-anchor="middle">Baseline 比對</text>
  <text x="405" y="93" fill="#5a5550" font-size="9" text-anchor="middle">PASS / FAIL 判定</text>
  <text x="405" y="106" fill="#5a5550" font-size="9" text-anchor="middle">差異量化</text>
  <line x1="460" y1="85" x2="480" y2="85" stroke="#5a5550" stroke-width="1.2" marker-end="url(#aqArr)"/>
  <!-- CI/CD -->
  <rect x="485" y="45" width="90" height="80" rx="6" fill="rgba(196,64,64,0.12)" stroke="#c44040" stroke-width="1.5"/>
  <text x="530" y="65" fill="#c44040" font-size="11" text-anchor="middle" font-weight="500">CI/CD</text>
  <text x="530" y="80" fill="#5a5550" font-size="9" text-anchor="middle">Jenkins / GitLab</text>
  <text x="530" y="93" fill="#5a5550" font-size="9" text-anchor="middle">自動觸發</text>
  <text x="530" y="106" fill="#5a5550" font-size="9" text-anchor="middle">報告產出</text>
  <!-- Feedback -->
  <path d="M530,125 L530,155 Q530,165 520,165 L80,165 Q70,165 70,155 L70,125" fill="none" stroke="#6a8a7a" stroke-width="1.2" stroke-dasharray="4,3" marker-end="url(#aqArr)"/>
  <text x="300" y="178" fill="#6a8a7a" font-size="9" text-anchor="middle">FAIL → 自動通知工程師 / 觸發 Bisect</text>
  <!-- Detail boxes -->
  <rect x="30" y="200" width="260" height="140" rx="6" fill="rgba(196,160,100,0.06)" stroke="#d5cec7" stroke-width="1"/>
  <text x="160" y="218" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">Capture Automation 細節</text>
  <text x="45" y="238" fill="#5a5550" font-size="9">• 場景清單（光箱 / 色溫 / Lux）自動切換</text>
  <text x="45" y="255" fill="#5a5550" font-size="9">• 多 ISO / 多曝光組合矩陣拍攝</text>
  <text x="45" y="272" fill="#5a5550" font-size="9">• RAW + Processed JPEG 同時儲存</text>
  <text x="45" y="289" fill="#5a5550" font-size="9">• 拍攝參數 metadata 自動記錄</text>
  <text x="45" y="306" fill="#5a5550" font-size="9">• 支援 DUT 自動重啟與韌體切換</text>
  <text x="45" y="323" fill="#5a5550" font-size="9">• 每輪拍攝 50-200 張，耗時 10-30 分鐘</text>
  <rect x="310" y="200" width="265" height="140" rx="6" fill="rgba(106,138,122,0.06)" stroke="#d5cec7" stroke-width="1"/>
  <text x="442" y="218" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Metric Pipeline 細節</text>
  <text x="325" y="238" fill="#5a5550" font-size="9">• Imatest CLI / Python 腳本自動分析</text>
  <text x="325" y="255" fill="#5a5550" font-size="9">• 自動偵測 Chart ROI 與裁切</text>
  <text x="325" y="272" fill="#5a5550" font-size="9">• 輸出 JSON/CSV 格式的指標資料</text>
  <text x="325" y="289" fill="#5a5550" font-size="9">• 自動計算 ΔE、MTF50、SNR @18%</text>
  <text x="325" y="306" fill="#5a5550" font-size="9">• 歷史趨勢圖自動更新</text>
  <text x="325" y="323" fill="#5a5550" font-size="9">• 原始數據歸檔供追溯</text>
</svg><div class="caption">圖 7-11：IQ 自動化測試框架 — 從拍攝到 CI/CD 的完整流程</div></div>

<h3>Capture Automation 設計</h3>
<p>自動化拍攝的核心挑戰在於<strong>環境控制</strong>和<strong>設備通信</strong>。典型架構如下：</p>
<ul>
  <li><strong>光源控制器</strong>：透過 RS-232 或 TCP 控制色溫和照度（如 Thouslite 光箱）</li>
  <li><strong>DUT 控制</strong>：透過 ADB（Android）或 UART 發送拍攝指令，控制 ISO、曝光時間等</li>
  <li><strong>圖卡切換</strong>：電動旋轉台自動切換不同測試圖卡（Macbeth、SFR、Noise）</li>
  <li><strong>影像回傳</strong>：透過 ADB pull 或網路傳輸將 RAW/JPEG 傳回分析伺服器</li>
</ul>

<h3>Metric Extraction Pipeline</h3>
<p>指標萃取管線是框架的核心，負責從影像中自動計算各項 IQ 指標：</p>

<div class="table-container">
<table>
  <tr><th>指標類別</th><th>具體指標</th><th>測試圖卡</th><th>萃取方法</th></tr>
  <tr><td>解析力</td><td>MTF50, MTF at Nyquist</td><td>SFR Chart (ISO 12233)</td><td>Slanted-edge 分析</td></tr>
  <tr><td>色彩準確度</td><td>ΔE2000 (mean/max)</td><td>Macbeth ColorChecker</td><td>色差計算</td></tr>
  <tr><td>噪聲</td><td>SNR@18%, Temporal Noise</td><td>Gray Patch / Flat Field</td><td>統計分析</td></tr>
  <tr><td>動態範圍</td><td>DR in dB / stops</td><td>Xyla / TE42</td><td>灰階遞增分析</td></tr>
  <tr><td>畸變</td><td>Distortion %</td><td>Grid Chart</td><td>直線偏差量測</td></tr>
  <tr><td>色偏</td><td>AWB ΔE, Correlated ΔCT</td><td>Neutral Patch</td><td>灰塊色度分析</td></tr>
</table>
</div>

<h3>Regression Testing 策略</h3>
<p>回歸測試的核心概念是維護一組 <strong>Baseline</strong>（基準值），每次測試結果與 Baseline 比對。判定規則包含：</p>
<ul>
  <li><strong>Hard Fail</strong>：指標超出規格上下限（如 ΔE2000 mean > 5.0），表示嚴重品質問題</li>
  <li><strong>Soft Fail</strong>：指標相較前次惡化超過閾值（如 MTF50 下降 > 5%），需要人工檢視</li>
  <li><strong>Trend Alert</strong>：指標連續 3 次同方向變化，即使未達閾值也發出警告</li>
</ul>

<h3>CI/CD 整合模式</h3>
<p>將 IQ 測試整合到 CI/CD 管線中是最終目標。常見的整合模式：</p>
<ul>
  <li><strong>Nightly Build</strong>：每晚自動燒錄最新韌體 → 執行完整 IQ 測試套件 → 產出報告</li>
  <li><strong>Merge Gate</strong>：ISP 相關的 MR/PR 合併前必須通過 IQ Smoke Test</li>
  <li><strong>Release Qualification</strong>：版本發佈前執行完整的 IQ 測試矩陣（全場景 × 全光照 × 全 ISO）</li>
</ul>

<div class="note">
  <strong>實務建議：</strong>初始投資搭建自動化框架的時間約 2-4 週，但在後續的開發週期中可節省數倍的人力。關鍵是先從最常用的 5-10 個場景開始自動化，再逐步擴展覆蓋範圍。
</div>
`
    },
    {
      id: "ch7_12",
      title: "Noise Profile 建立與校準",
      content: `
<h3>Noise Profile 的角色</h3>
<p>在 ISP Pipeline 中，<strong>Noise Reduction（NR）</strong>是最關鍵也最容易出錯的模組之一。NR 做得太少，影像充滿噪點；NR 做得太多，細節被抹除，產生蠟像感。要讓 NR 精確運作的前提是——<strong>你必須準確知道噪聲有多大</strong>。這就是 Noise Profile（噪聲特性描述）的核心意義。</p>

<p>Noise Profile 描述的是：在給定的感光度（ISO / Gain）和像素亮度下，噪聲的統計特性（主要是 variance 或 standard deviation）。有了精確的 Noise Profile，NR 模組才能區分「這是噪聲」和「這是細節」。</p>

<div class="diagram"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="340" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Noise Model：Photon Noise + Read Noise</text>
  <!-- Axes -->
  <line x1="80" y1="280" x2="550" y2="280" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="80" y1="280" x2="80" y2="50" stroke="#5a5550" stroke-width="1.5"/>
  <text x="315" y="310" fill="#5a5550" font-size="11" text-anchor="middle">Signal Level (DN)</text>
  <text x="35" y="165" fill="#5a5550" font-size="11" text-anchor="middle" transform="rotate(-90,35,165)">Noise Variance (σ²)</text>
  <!-- Grid -->
  <line x1="80" y1="230" x2="550" y2="230" stroke="#e0dbd5" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="80" y1="180" x2="550" y2="180" stroke="#e0dbd5" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="80" y1="130" x2="550" y2="130" stroke="#e0dbd5" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="80" y1="80" x2="550" y2="80" stroke="#e0dbd5" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Total noise curve -->
  <path d="M80,240 Q200,220 300,170 Q400,120 500,70 L550,50" fill="none" stroke="#c44040" stroke-width="2"/>
  <text x="555" y="48" fill="#c44040" font-size="10" font-weight="500">Total</text>
  <!-- Photon noise (linear) -->
  <path d="M80,270 Q200,250 300,200 Q400,140 500,85 L550,60" fill="none" stroke="#4a7ab5" stroke-width="1.5" stroke-dasharray="6,3"/>
  <text x="555" y="62" fill="#4a7ab5" font-size="10">Photon</text>
  <!-- Read noise (flat) -->
  <line x1="80" y1="250" x2="550" y2="250" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="555" y="252" fill="#6a8a7a" font-size="10">Read</text>
  <!-- Formula box -->
  <rect x="150" y="40" width="280" height="45" rx="4" fill="rgba(255,255,255,0.8)" stroke="#d5cec7" stroke-width="1"/>
  <text x="290" y="58" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">σ²_total = a · S + b</text>
  <text x="290" y="75" fill="#8a8580" font-size="9" text-anchor="middle">a = photon noise coefficient, b = read noise variance, S = signal</text>
</svg><div class="caption">圖 7-12：感測器噪聲模型 — Total Noise = Photon Noise + Read Noise</div></div>

<h3>噪聲模型的數學基礎</h3>
<p>CMOS Image Sensor 的噪聲可以用簡潔的線性模型描述：</p>

<div class="formula">
σ²<sub>total</sub>(S) = a · S + b
</div>

<p>其中：</p>
<ul>
  <li><strong>S</strong>：信號水準（以 DN 或 electron 為單位）</li>
  <li><strong>a</strong>：Photon Noise 係數（與光子統計有關，服從 Poisson 分佈）</li>
  <li><strong>b</strong>：Read Noise variance（固定噪聲底，與信號無關）</li>
</ul>

<p>Photon Noise 是量子現象——光子到達 Pixel 的數量本身就有隨機波動，其 variance 正比於信號。Read Noise 則來自電路本身（感測放大器、ADC 量化等），與信號無關。在低光下 Read Noise 主導，在高光下 Photon Noise 主導。</p>

<h3>Per-ISO Noise Profile 建立流程</h3>
<p>為每個 ISO/Gain 設定建立獨立的 Noise Profile 是 ISP Tuning 的基礎校準步驟：</p>
<ol>
  <li><strong>拍攝 Flat Field</strong>：在均勻光源下（積分球或均勻光箱），拍攝多張（≥16 張）同一亮度的影像</li>
  <li><strong>掃描亮度範圍</strong>：調整光源強度或曝光時間，覆蓋從暗到亮的完整 DN 範圍</li>
  <li><strong>計算統計量</strong>：對每個亮度等級，計算像素值的 mean 和 variance</li>
  <li><strong>擬合模型</strong>：以 mean 為 x 軸、variance 為 y 軸，用最小二乘法擬合 σ² = a·S + b</li>
  <li><strong>對每個 ISO 重複</strong>：ISO 100, 200, 400, 800, 1600, 3200... 各做一次</li>
</ol>

<h3>Dark Frame Analysis</h3>
<p><strong>Dark Frame（暗場影像）</strong>是在感光元件完全不受光的狀態下拍攝的影像，用來量測 Read Noise 和 Dark Current：</p>
<ul>
  <li><strong>Read Noise 量測</strong>：短曝光（如 1/1000s）Dark Frame 的標準差即為 Read Noise</li>
  <li><strong>Dark Current 量測</strong>：比較不同曝光時間的 Dark Frame 均值差，斜率即為 Dark Current（electrons/s/pixel）</li>
  <li><strong>Hot Pixel 檢測</strong>：Dark Frame 中明顯偏亮的像素即為 Hot Pixel</li>
  <li><strong>Fixed Pattern Noise</strong>：多張 Dark Frame 的平均值揭示 Column/Row FPN</li>
</ul>

<h3>Noise Floor Measurement</h3>
<p>噪聲底（Noise Floor）是系統能感受到的最小信號變化，直接決定了低光下的影像品質：</p>

<div class="table-container">
<table>
  <tr><th>量測項目</th><th>方法</th><th>典型值（現代 Sensor）</th></tr>
  <tr><td>Temporal Read Noise</td><td>多張 Dark Frame 的時間方向 stddev</td><td>1-3 e⁻ (rms)</td></tr>
  <tr><td>Fixed Pattern Noise</td><td>多張 Dark Frame 平均後的空間 stddev</td><td>0.5-2 DN (after CDS)</td></tr>
  <tr><td>Dark Current @25°C</td><td>長短曝光 Dark Frame 差異</td><td>5-50 e⁻/s/pixel</td></tr>
  <tr><td>ADC Quantization Noise</td><td>理論值 = LSB/√12</td><td>0.3 DN (10-bit)</td></tr>
</table>
</div>

<div class="note">
  <strong>校準頻率：</strong>Noise Profile 在感測器設計確定後通常只需校準一次（per ISO）。但如果有溫度需求（如車用 -40°C~85°C），則需要在不同溫度點分別校準，因為 Dark Current 和 Read Noise 都會隨溫度變化。
</div>
`
    },
    {
      id: "ch7_13",
      title: "Lens Shading Calibration",
      content: `
<h3>什麼是 Lens Shading？</h3>
<p><strong>Lens Shading（鏡頭遮蔽）</strong>是所有光學系統中不可避免的現象：影像中心的亮度比邊緣高。這個效應由兩個物理因素造成：一是 <strong>cos⁴ 法則</strong>（離軸光線隨角度衰減）；二是<strong>機械遮蔽</strong>（鏡頭鏡筒、光圈等對邊緣光線的遮擋）。如果不校正，影像四角會明顯偏暗，且不同 R/G/B 通道的衰減曲線不同，還會造成<strong>色偏</strong>（Color Shading）。</p>

<p><strong>Lens Shading Calibration（LSC 校準）</strong>的目標是精確量測這個衰減特性，並在 ISP 中進行反向補償，讓影像亮度和色彩在整個視場內均勻一致。</p>

<div class="diagram"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Lens Shading 校正流程</text>
  <defs>
    <marker id="lscArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
  </defs>
  <!-- Step 1: Flat field capture -->
  <rect x="25" y="50" width="110" height="70" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="80" y="70" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">Flat Field 拍攝</text>
  <text x="80" y="85" fill="#5a5550" font-size="8" text-anchor="middle">均勻光源</text>
  <text x="80" y="97" fill="#5a5550" font-size="8" text-anchor="middle">多色溫 × 多 ISO</text>
  <text x="80" y="109" fill="#5a5550" font-size="8" text-anchor="middle">RAW 影像</text>
  <line x1="135" y1="85" x2="155" y2="85" stroke="#5a5550" stroke-width="1.2" marker-end="url(#lscArr)"/>
  <!-- Step 2: Extract shading map -->
  <rect x="160" y="50" width="110" height="70" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="215" y="70" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">Shading Map</text>
  <text x="215" y="85" fill="#5a5550" font-size="8" text-anchor="middle">per-channel 分析</text>
  <text x="215" y="97" fill="#5a5550" font-size="8" text-anchor="middle">亮度衰減曲線</text>
  <text x="215" y="109" fill="#5a5550" font-size="8" text-anchor="middle">Normalize to center</text>
  <line x1="270" y1="85" x2="290" y2="85" stroke="#5a5550" stroke-width="1.2" marker-end="url(#lscArr)"/>
  <!-- Step 3: Mesh grid -->
  <rect x="295" y="50" width="110" height="70" rx="6" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="350" y="70" fill="#4a7ab5" font-size="10" text-anchor="middle" font-weight="500">Mesh Grid 生成</text>
  <text x="350" y="85" fill="#5a5550" font-size="8" text-anchor="middle">降採樣為 NxM 網格</text>
  <text x="350" y="97" fill="#5a5550" font-size="8" text-anchor="middle">典型 17×13 ~ 33×25</text>
  <text x="350" y="109" fill="#5a5550" font-size="8" text-anchor="middle">Bilinear 插值係數</text>
  <line x1="405" y1="85" x2="425" y2="85" stroke="#5a5550" stroke-width="1.2" marker-end="url(#lscArr)"/>
  <!-- Step 4: Program to ISP -->
  <rect x="430" y="50" width="140" height="70" rx="6" fill="rgba(196,64,64,0.12)" stroke="#c44040" stroke-width="1.5"/>
  <text x="500" y="70" fill="#c44040" font-size="10" text-anchor="middle" font-weight="500">寫入 ISP 寄存器</text>
  <text x="500" y="85" fill="#5a5550" font-size="8" text-anchor="middle">Gain Table → HW Register</text>
  <text x="500" y="97" fill="#5a5550" font-size="8" text-anchor="middle">或 OTP 燒錄</text>
  <text x="500" y="109" fill="#5a5550" font-size="8" text-anchor="middle">R/Gr/Gb/B 四通道</text>
  <!-- Before/After illustration -->
  <rect x="25" y="150" width="260" height="130" rx="6" fill="rgba(196,64,64,0.06)" stroke="#d5cec7" stroke-width="1"/>
  <text x="155" y="170" fill="#c44040" font-size="11" text-anchor="middle" font-weight="500">校正前 — Flat Field</text>
  <ellipse cx="155" cy="225" rx="110" ry="50" fill="none" stroke="#c44040" stroke-width="1" stroke-dasharray="3,3"/>
  <ellipse cx="155" cy="225" rx="80" ry="36" fill="none" stroke="#c44040" stroke-width="0.8" stroke-dasharray="3,3"/>
  <ellipse cx="155" cy="225" rx="45" ry="20" fill="none" stroke="#c44040" stroke-width="0.6" stroke-dasharray="3,3"/>
  <text x="155" y="228" fill="#5a5550" font-size="9" text-anchor="middle">100%</text>
  <text x="235" y="228" fill="#c44040" font-size="8" text-anchor="middle">60-70%</text>
  <rect x="310" y="150" width="265" height="130" rx="6" fill="rgba(106,138,122,0.06)" stroke="#d5cec7" stroke-width="1"/>
  <text x="442" y="170" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">校正後 — 均勻亮度</text>
  <rect x="340" y="190" width="205" height="75" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="442" y="232" fill="#6a8a7a" font-size="10" text-anchor="middle">~100% 均勻</text>
</svg><div class="caption">圖 7-13：LSC 校準流程 — 從 Flat Field 拍攝到 ISP Mesh Grid 寫入</div></div>

<h3>Per-unit vs Golden Sample 校準</h3>
<p>LSC 校準有兩種策略，取決於生產需求和成本考量：</p>
<ul>
  <li><strong>Golden Sample 校準</strong>：只用一組「標準」模組做校準，所有產品共用同一組 Shading Table。優點是不需要產線校準設備，缺點是無法補償個體差異（鏡頭組裝偏心、Sensor 敏感度不均等）。適合<strong>低成本消費品</strong></li>
  <li><strong>Per-unit 校準</strong>：每顆模組在產線上都獨立做 Flat Field 拍攝和校準，產生專屬的 Shading Table 並燒入 OTP。優點是校正精度高（個體差異 < 2%），缺點是需要產線設備投資。適合<strong>旗艦手機、車用模組</strong></li>
</ul>

<h3>Mesh Grid Compensation 原理</h3>
<p>ISP 硬體中 LSC 的實現方式通常是 <strong>Mesh Grid + Bilinear Interpolation</strong>：</p>
<ul>
  <li>將影像劃分為 N×M 的網格（如 17×13），每個網格交叉點存一個 Gain 值</li>
  <li>每個 Pixel 的補償 Gain 由最近的 4 個網格點做 Bilinear 內插得到</li>
  <li>R、Gr、Gb、B 四個通道各有獨立的 Gain Table</li>
  <li>Gain 值通常以定點數存儲（如 4.8 格式，即 4 bit 整數 + 8 bit 小數）</li>
</ul>

<div class="formula">
Gain(x,y) = (1-α)(1-β)·G<sub>00</sub> + α(1-β)·G<sub>10</sub> + (1-α)β·G<sub>01</sub> + αβ·G<sub>11</sub>
</div>

<h3>Color Shading 校正</h3>
<p>Color Shading（色彩遮蔽）是指 R/G/B 通道的衰減曲線不同，導致影像邊緣出現色偏（通常偏綠或偏紅）。Color Shading 的主要來源：</p>
<ul>
  <li><strong>CRA Mismatch</strong>：Sensor Microlens 的 Chief Ray Angle 與鏡頭出射角不匹配</li>
  <li><strong>IR Filter 角度效應</strong>：IR-cut Filter 的截止波長隨入射角變化</li>
  <li><strong>Lens Chromatic Aberration</strong>：鏡頭的色差在邊緣更明顯</li>
</ul>

<h3>Vignetting Correction 強度控制</h3>
<p>實務上 LSC 通常不做 100% 補償，而是保留少量暗角效果（如補償 80-90%）：</p>
<ul>
  <li>100% 補償會在角落施加大 Gain（可能 1.5x ~ 3x），同時放大了噪聲</li>
  <li>人眼對輕微暗角的容忍度較高，但對角落噪聲很敏感</li>
  <li>因此在 SNR 和均勻度之間需要取捨，通常角落 Gain 限制在 2x 以內</li>
</ul>

<div class="note">
  <strong>量產提醒：</strong>LSC 校準是產線校準中最耗時的步驟之一。為了縮短 Cycle Time，通常會用高速光源和並行計算。Per-unit LSC 校準精度建議控制在：Luminance Shading < 5%（角落 vs 中心），Color Shading ΔE < 2.0。
</div>
`
    },
    {
      id: "ch7_14",
      title: "Defect Pixel Calibration",
      content: `
<h3>Defect Pixel 的來源與分類</h3>
<p><strong>Defect Pixel（缺陷像素）</strong>是 CMOS Image Sensor 製造過程中不可避免的問題。即使良率很高的 Sensor，在數百萬到數千萬的像素中，也會存在一定比例的缺陷像素。這些像素的輸出值不正確——可能永遠偏亮（Hot Pixel）、永遠偏暗（Cold/Dead Pixel）、或者響應異常。ISP 中的 <strong>DPC（Defect Pixel Correction）</strong>模組負責偵測並修補這些缺陷。</p>

<div class="diagram"><svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="320" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Defect Pixel 分類與校正策略</text>
  <!-- Static defects -->
  <rect x="25" y="45" width="260" height="120" rx="6" fill="rgba(196,64,64,0.08)" stroke="#c44040" stroke-width="1.5"/>
  <text x="155" y="65" fill="#c44040" font-size="12" text-anchor="middle" font-weight="500">Static Defect（靜態缺陷）</text>
  <text x="40" y="85" fill="#5a5550" font-size="9">• Hot Pixel：Dark 下異常亮（Dark Current 極高）</text>
  <text x="40" y="100" fill="#5a5550" font-size="9">• Dead Pixel：永遠輸出 0 或固定值</text>
  <text x="40" y="115" fill="#5a5550" font-size="9">• Stuck Pixel：永遠輸出最大值</text>
  <text x="40" y="130" fill="#5a5550" font-size="9">• Weak Pixel：響應低於正常值 &gt;20%</text>
  <text x="40" y="150" fill="#8a8580" font-size="8">校正方式：靜態表（Static Table）→ 出廠校準</text>
  <!-- Dynamic defects -->
  <rect x="310" y="45" width="265" height="120" rx="6" fill="rgba(74,122,181,0.08)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="442" y="65" fill="#4a7ab5" font-size="12" text-anchor="middle" font-weight="500">Dynamic Defect（動態缺陷）</text>
  <text x="325" y="85" fill="#5a5550" font-size="9">• 僅在特定條件下出現（高溫、長曝光）</text>
  <text x="325" y="100" fill="#5a5550" font-size="9">• 隨時間老化而增加的新缺陷</text>
  <text x="325" y="115" fill="#5a5550" font-size="9">• 隨機出現的瞬態異常像素</text>
  <text x="325" y="130" fill="#5a5550" font-size="9">• Cosmic Ray 造成的瞬間亮點</text>
  <text x="325" y="150" fill="#8a8580" font-size="8">校正方式：即時偵測（Dynamic Detection）→ ISP 演算法</text>
  <!-- Cluster defects -->
  <rect x="25" y="185" width="260" height="55" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="155" y="205" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">Cluster Defect（叢集缺陷）</text>
  <text x="40" y="225" fill="#5a5550" font-size="9">多個相鄰缺陷像素構成的區塊，校正難度更高</text>
  <!-- Correction method -->
  <rect x="310" y="185" width="265" height="55" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="442" y="205" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Correction Method</text>
  <text x="325" y="225" fill="#5a5550" font-size="9">鄰域插值：Median / Gradient-based / Directional</text>
  <!-- Threshold table -->
  <rect x="25" y="255" width="550" height="50" rx="6" fill="rgba(255,255,255,0.5)" stroke="#d5cec7" stroke-width="1"/>
  <text x="300" y="273" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">典型判定閾值</text>
  <text x="120" y="293" fill="#c44040" font-size="9" text-anchor="middle">Hot: Dark &gt; μ + 6σ</text>
  <text x="300" y="293" fill="#4a7ab5" font-size="9" text-anchor="middle">Dead: Light &lt; μ - 6σ</text>
  <text x="480" y="293" fill="#c4a064" font-size="9" text-anchor="middle">Weak: Response &lt; 0.8× Normal</text>
</svg><div class="caption">圖 7-14：Defect Pixel 分類 — 靜態、動態與叢集缺陷的校正策略</div></div>

<h3>Static Defect Detection 流程</h3>
<p>靜態缺陷偵測通常在產線上完成，流程如下：</p>
<ol>
  <li><strong>Dark Frame 拍攝</strong>：在遮光狀態下拍攝多張影像，偵測 Hot Pixel
    <ul><li>條件：25°C、多種曝光時間（100ms、500ms、1s）</li></ul>
  </li>
  <li><strong>Bright Frame 拍攝</strong>：在均勻光源下拍攝，偵測 Dead/Weak Pixel
    <ul><li>條件：多種亮度等級（20%、50%、80% saturation）</li></ul>
  </li>
  <li><strong>統計分析</strong>：對每張影像計算全局 mean (μ) 和 stddev (σ)，標記超出閾值的像素</li>
  <li><strong>合併列表</strong>：將所有條件下偵測到的缺陷像素合併、去重</li>
  <li><strong>寫入 OTP</strong>：將缺陷列表（座標）燒入 Sensor 的 OTP memory</li>
</ol>

<h3>Dynamic Defect Detection 演算法</h3>
<p>ISP 硬體中的動態 DPC 即時運行，典型演算法：</p>
<ul>
  <li><strong>5×5 鄰域比較</strong>：將中心像素與同色鄰域的 min/max 比較</li>
  <li>如果 pixel > max + threshold 或 pixel < min - threshold，判定為缺陷</li>
  <li><strong>方向性插值</strong>：沿水平/垂直/對角方向取梯度最小的方向進行插值修補</li>
  <li>避免在邊緣處誤判——高對比邊緣的像素可能超出鄰域範圍但並非缺陷</li>
</ul>

<h3>Cluster Correction</h3>
<p>叢集缺陷（2 個以上相鄰缺陷像素）是 DPC 的難點：</p>
<ul>
  <li>單一缺陷可以用鄰域正常像素插值，但如果鄰域也是缺陷，就無法可靠插值</li>
  <li>ISP 硬體通常支援 2-pixel cluster（允許一對相鄰缺陷），但 3×3 以上的叢集無法處理</li>
  <li>大面積叢集缺陷的模組通常在產線上直接判為不良品（Fail）</li>
</ul>

<h3>Threshold Setting 策略</h3>

<div class="table-container">
<table>
  <tr><th>參數</th><th>保守值</th><th>寬鬆值</th><th>考量</th></tr>
  <tr><td>Hot Pixel 閾值</td><td>μ + 4σ</td><td>μ + 8σ</td><td>嚴格→偵測更多但可能 false positive</td></tr>
  <tr><td>Dead Pixel 閾值</td><td>μ - 4σ</td><td>μ - 8σ</td><td>嚴格→偵測更多但可能 false positive</td></tr>
  <tr><td>Dynamic DPC 強度</td><td>Low (大 threshold)</td><td>High (小 threshold)</td><td>太強會抹除高頻細節</td></tr>
  <tr><td>允許缺陷數上限</td><td>50 pixels</td><td>200 pixels</td><td>超出→判定模組不良</td></tr>
  <tr><td>Cluster 允許數</td><td>0</td><td>5 clusters</td><td>依產品等級而定</td></tr>
</table>
</div>

<div class="note">
  <strong>Hot/Cold Pixel 判定標準：</strong>「多少算異常」沒有絕對標準，取決於產品定位。旗艦手機可能要求 < 30 個 Hot Pixel（全暗場 1s@25°C），而低階產品可能允許 200 個以上。關鍵是確保 DPC 能正確修補所有已知缺陷，且不會在正常細節上誤觸發。
</div>
`
    },
    {
      id: "ch7_15",
      title: "Multi-camera IQ 一致性",
      content: `
<h3>Multi-camera 系統的 IQ 挑戰</h3>
<p>現代智慧手機普遍配備 2-5 顆鏡頭（廣角、超廣角、望遠、微距等），車用 ADAS 系統更可能有 8-12 顆相機。當使用者在不同鏡頭之間切換（如手機 1x → 3x），或在多鏡頭拼接場景（如環景系統），<strong>各鏡頭之間的 IQ 一致性</strong>成為關鍵的使用體驗問題。</p>

<p>IQ 不一致的典型表現：切換鏡頭時色溫突然跳變、亮度差異明顯、白平衡不同導致膚色偏差。這些在單張照片中可能不明顯，但在鏡頭切換或拼接場景中會非常刺眼。</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Multi-camera IQ 一致性校正架構</text>
  <defs>
    <marker id="mcArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
  </defs>
  <!-- Camera modules -->
  <rect x="25" y="50" width="100" height="55" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="75" y="70" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">Wide (主鏡頭)</text>
  <text x="75" y="85" fill="#5a5550" font-size="8" text-anchor="middle">Sensor A + Lens A</text>
  <text x="75" y="97" fill="#8a8580" font-size="7" text-anchor="middle">Reference Camera</text>
  <rect x="140" y="50" width="100" height="55" rx="6" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="190" y="70" fill="#4a7ab5" font-size="10" text-anchor="middle" font-weight="500">Ultra-wide</text>
  <text x="190" y="85" fill="#5a5550" font-size="8" text-anchor="middle">Sensor B + Lens B</text>
  <rect x="255" y="50" width="100" height="55" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="305" y="70" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">Tele 3x</text>
  <text x="305" y="85" fill="#5a5550" font-size="8" text-anchor="middle">Sensor C + Lens C</text>
  <rect x="370" y="50" width="100" height="55" rx="6" fill="rgba(196,64,64,0.12)" stroke="#c44040" stroke-width="1.5"/>
  <text x="420" y="70" fill="#c44040" font-size="10" text-anchor="middle" font-weight="500">Tele 10x</text>
  <text x="420" y="85" fill="#5a5550" font-size="8" text-anchor="middle">Sensor D + Lens D</text>
  <!-- Arrows down -->
  <line x1="75" y1="105" x2="75" y2="135" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <line x1="190" y1="105" x2="190" y2="135" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <line x1="305" y1="105" x2="305" y2="135" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <line x1="420" y1="105" x2="420" y2="135" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <!-- Individual ISP -->
  <rect x="25" y="140" width="470" height="45" rx="6" fill="rgba(255,255,255,0.5)" stroke="#d5cec7" stroke-width="1"/>
  <text x="260" y="160" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">各鏡頭獨立 ISP Tuning（BLC / LSC / AWB / CCM / NR）</text>
  <text x="260" y="175" fill="#8a8580" font-size="9" text-anchor="middle">每顆鏡頭有不同 Sensor 特性和鏡頭光學特性，需要獨立校準</text>
  <line x1="260" y1="185" x2="260" y2="210" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <!-- Cross-camera calibration -->
  <rect x="25" y="215" width="470" height="55" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="260" y="235" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">Cross-camera Calibration（跨鏡頭校正）</text>
  <text x="120" y="255" fill="#5a5550" font-size="9" text-anchor="middle">Color Matching</text>
  <text x="250" y="255" fill="#5a5550" font-size="9" text-anchor="middle">Brightness Matching</text>
  <text x="390" y="255" fill="#5a5550" font-size="9" text-anchor="middle">AWB Sync</text>
  <line x1="260" y1="270" x2="260" y2="295" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <!-- Result -->
  <rect x="100" y="300" width="320" height="35" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="260" y="322" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">鏡頭切換時 IQ 一致、無色溫/亮度跳變</text>
  <!-- Side note -->
  <rect x="505" y="50" width="80" height="220" rx="6" fill="rgba(74,122,181,0.06)" stroke="#4a7ab5" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="545" y="120" fill="#4a7ab5" font-size="9" text-anchor="middle" transform="rotate(90,545,120)">Runtime AWB Sync Engine</text>
</svg><div class="caption">圖 7-15：Multi-camera IQ 一致性架構 — 從獨立校準到跨鏡頭匹配</div></div>

<h3>Color Matching（色彩匹配）</h3>
<p>不同 Sensor 的光譜響應曲線不同，即使通過 CCM 校正後，在某些光源下仍可能存在色差。Color Matching 的目標是讓所有鏡頭在相同場景下呈現一致的色彩：</p>
<ul>
  <li><strong>Reference Camera</strong>：選定一顆主鏡頭作為色彩基準（通常是廣角主鏡頭）</li>
  <li><strong>Cross-CCM</strong>：計算其他鏡頭到 Reference 的色彩轉換矩陣，在多種光源下（D65、TL84、A、CWF）量測</li>
  <li><strong>Per-illuminant Matching</strong>：在不同色溫下可能需要不同的修正係數</li>
  <li>目標：相同場景下，任意兩顆鏡頭的 Macbeth Patch ΔE2000 < 3.0</li>
</ul>

<h3>Brightness Matching（亮度匹配）</h3>
<p>不同鏡頭的 F-number、Sensor 靈敏度和 AE 策略不同，可能在相同場景下呈現不同的亮度：</p>
<ul>
  <li>校正方法：在同一場景下，測量各鏡頭的平均亮度，計算 Gain Offset</li>
  <li>Runtime 上，AE 模組需要有 <strong>Cross-camera Brightness Sync</strong>——當鏡頭切換時，新鏡頭的 AE 初始值基於舊鏡頭的測光結果換算</li>
  <li>目標：切換瞬間的亮度跳變 < 0.3 EV</li>
</ul>

<h3>AWB Sync（白平衡同步）</h3>
<p>AWB Sync 是 Multi-camera 一致性中最關鍵也最困難的部分。即使兩顆鏡頭看同一場景，由於 Sensor 光譜差異和 AWB 演算法的非確定性，可能算出不同的白平衡增益：</p>
<ul>
  <li><strong>Master-Slave 模式</strong>：主鏡頭（通常是 Wide）的 AWB 結果同步到副鏡頭，副鏡頭再根據自身 Sensor 特性做轉換</li>
  <li><strong>Shared Decision</strong>：多顆鏡頭的 AWB 統計資料匯總後，由一個統一的 AWB 引擎做決策</li>
  <li><strong>Smooth Transition</strong>：切換鏡頭時，AWB 增益不能瞬間跳變，需要平滑過渡（如 200-500ms 漸變）</li>
</ul>

<h3>Cross-camera Calibration 流程</h3>
<ol>
  <li>所有鏡頭先完成各自的獨立 IQ Tuning</li>
  <li>在標準光源下，所有鏡頭同時拍攝 Macbeth ColorChecker</li>
  <li>以主鏡頭為基準，計算各副鏡頭的 Color Offset 和 Brightness Offset</li>
  <li>在多種光源（D65、A、TL84、CWF）下重複，建立 per-illuminant 修正表</li>
  <li>整合到 Runtime AWB Sync Engine，確保即時同步</li>
</ol>

<div class="note">
  <strong>實務經驗：</strong>Multi-camera IQ 一致性是一個需要持續迭代的工作。即使在實驗室校準完美，在真實場景中（混合光源、邊緣色溫差異）仍可能出現不一致。建議建立一組涵蓋常見場景的 IQ 一致性測試用例，持續追蹤和優化。
</div>
`
    },
    {
      id: "ch7_16",
      title: "低光 IQ 調適",
      content: `
<h3>低光場景的核心挑戰</h3>
<p>低光（Low-light）場景是 ISP Tuning 中最具挑戰性的領域。在 < 10 lux 甚至 < 1 lux 的環境下，Sensor 接收到的光子數量極少，Signal-to-Noise Ratio（SNR）急劇下降。此時 ISP 需要在<strong>噪聲抑制</strong>和<strong>細節保留</strong>之間做出艱難的取捨——Noise Reduction 做多了影像變糊、出現蠟像感；做少了噪點滿畫面。</p>

<p>低光 IQ 調適的目標不是「讓低光影像和日光一樣好」，而是在有限的信號中<strong>盡可能保留有用資訊，同時控制噪聲到可接受的水準</strong>。這需要 ISP 各模組的協同配合。</p>

<h3>NR Strength vs Detail Trade-off</h3>
<p>Noise Reduction 強度的調適是低光 IQ 的核心。典型的 NR 強度控制策略：</p>

<div class="table-container">
<table>
  <tr><th>ISO / Gain</th><th>NR 空間域強度</th><th>NR 時間域強度</th><th>Sharpening</th><th>視覺特性</th></tr>
  <tr><td>ISO 100-400</td><td>Low</td><td>N/A</td><td>Strong</td><td>清晰銳利，噪聲不可見</td></tr>
  <tr><td>ISO 800-1600</td><td>Medium</td><td>Low</td><td>Medium</td><td>輕微噪聲，細節良好</td></tr>
  <tr><td>ISO 3200-6400</td><td>High</td><td>Medium</td><td>Low</td><td>明顯降噪，細節有損失</td></tr>
  <tr><td>ISO 12800+</td><td>Very High</td><td>High</td><td>Very Low</td><td>強烈降噪，蠟像感風險</td></tr>
</table>
</div>

<p>關鍵原則：NR 強度應該隨 ISO/Gain 逐漸增加，Sharpening 則相應降低。NR 和 Sharpening 不能同時開到最大——那會導致「降噪後再銳化噪聲殘留」的糟糕結果。</p>

<h3>Long Exposure Noise Reduction</h3>
<p>長曝光（> 1s）會引入額外的噪聲源：</p>
<ul>
  <li><strong>Dark Current Noise</strong>：累積的暗電流產生固定模式噪聲（FPN），隨曝光時間和溫度線性增加</li>
  <li><strong>Dark Frame Subtraction</strong>：拍一張同曝光時間的 Dark Frame，逐像素相減消除 FPN。缺點是需要額外的拍攝時間</li>
  <li><strong>Hot Pixel Mapping</strong>：長曝光下 Hot Pixel 變得更明顯，需要更積極的 DPC</li>
  <li><strong>Star Eater 問題</strong>：過於積極的 Hot Pixel 校正可能把星空中的星星誤判為 Hot Pixel 而消除</li>
</ul>

<h3>Multi-frame Noise Reduction（MFNR）</h3>
<p>MFNR 是現代手機低光攝影的核心技術。原理是拍攝多張短曝光影像，對齊後融合以降低噪聲：</p>
<ul>
  <li><strong>理論增益</strong>：N 張融合可將噪聲降低 √N 倍（約 3dB per 2x frames）</li>
  <li><strong>典型配置</strong>：4-16 張融合，等效 SNR 提升 6-12 dB</li>
  <li><strong>Motion Handling</strong>：全域 Motion Estimation + 局部 Optical Flow 對齊，處理手持晃動和場景運動</li>
  <li><strong>Robustness</strong>：運動區域降低融合權重，避免鬼影（Ghosting）</li>
</ul>

<div class="formula">
SNR<sub>MFNR</sub> = SNR<sub>single</sub> × √N　（理想情況，N = 融合張數）
</div>

<h3>LED / Flash Integration</h3>
<p>在極低光環境下，補光是提升 IQ 的最直接方式：</p>
<ul>
  <li><strong>Pre-flash（預閃）</strong>：在主閃光前先發一次低功率閃光，用於 AF 和 AE 計算</li>
  <li><strong>Main Flash</strong>：主閃光的功率和持續時間需要根據 AE 結果精確控制</li>
  <li><strong>Flash AWB</strong>：閃光燈的色溫（通常 ~5500K）與環境光不同，需要計算混合色溫下的 AWB</li>
  <li><strong>Rear-curtain Sync</strong>：後簾同步——長曝光結束前才觸發閃光，可拍出「光軌 + 清晰主體」的效果</li>
  <li><strong>LED Torch Mode</strong>：持續低功率 LED 照明，用於 Video 錄影低光補光</li>
</ul>

<h3>低光 AE 策略</h3>
<p>低光下的自動曝光策略直接影響 IQ 表現：</p>
<ul>
  <li><strong>Exposure Triangle 優先順序</strong>：先延長曝光時間（到手持極限 ~1/15s）→ 再增加 ISO → 最後考慮開大光圈（如果可調）</li>
  <li><strong>Frame Rate 降低</strong>：Video 模式下可降低 Frame Rate（30fps → 24fps → 15fps）以增加每幀的曝光時間</li>
  <li><strong>Binning Mode</strong>：在極低光下切換到 2×2 Binning，犧牲解析度換取 4x 信號量提升</li>
</ul>

<div class="note">
  <strong>調適技巧：</strong>低光 IQ Tuning 最容易犯的錯誤是「只看降噪效果，忽略了色彩和對比度」。低光下色彩飽和度應該適度降低（而非強行拉高），對比度曲線也應該更平緩。人眼在低光下的色彩敏感度本來就較低，過於飽和的低光影像反而不自然。
</div>
`
    },
    {
      id: "ch7_17",
      title: "高動態場景 IQ 調適",
      content: `
<h3>HDR 場景的 IQ 挑戰</h3>
<p>高動態範圍（HDR）場景是 ISP Tuning 的另一大重點。典型的 HDR 場景包括：室內窗戶逆光、隧道出入口、夜間車燈、日落/日出等。這些場景中，最亮區域和最暗區域的亮度差異可達 <strong>100,000:1（>100 dB）</strong>以上，遠超單張曝光的動態範圍（通常 60-80 dB）。</p>

<p>HDR ISP 的目標是<strong>將場景的完整動態範圍壓縮到可顯示的 8-bit（或 10-bit）範圍內</strong>，同時保持視覺上的自然感。這涉及曝光策略、影像融合和 Tone Mapping 等多個環節的精細調適。</p>

<div class="diagram"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="340" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">HDR Exposure Ratio 與融合策略</text>
  <!-- Exposure ratio illustration -->
  <rect x="30" y="45" width="160" height="120" rx="6" fill="rgba(196,64,64,0.08)" stroke="#c44040" stroke-width="1.5"/>
  <text x="110" y="65" fill="#c44040" font-size="11" text-anchor="middle" font-weight="500">Short Exposure</text>
  <rect x="50" y="80" width="120" height="30" rx="3" fill="rgba(196,64,64,0.15)"/>
  <text x="110" y="100" fill="#5a5550" font-size="9" text-anchor="middle">高光細節 ✓ 暗部 ✗</text>
  <text x="110" y="125" fill="#8a8580" font-size="8" text-anchor="middle">Exposure = T/R</text>
  <text x="110" y="140" fill="#8a8580" font-size="8" text-anchor="middle">保護高光（窗外/天空）</text>
  <rect x="210" y="45" width="160" height="120" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="290" y="65" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Medium Exposure</text>
  <rect x="230" y="80" width="120" height="30" rx="3" fill="rgba(106,138,122,0.15)"/>
  <text x="290" y="100" fill="#5a5550" font-size="9" text-anchor="middle">中間調細節最佳</text>
  <text x="290" y="125" fill="#8a8580" font-size="8" text-anchor="middle">Exposure = T</text>
  <text x="290" y="140" fill="#8a8580" font-size="8" text-anchor="middle">Reference exposure</text>
  <rect x="390" y="45" width="180" height="120" rx="6" fill="rgba(74,122,181,0.08)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="480" y="65" fill="#4a7ab5" font-size="11" text-anchor="middle" font-weight="500">Long Exposure</text>
  <rect x="410" y="80" width="140" height="30" rx="3" fill="rgba(74,122,181,0.15)"/>
  <text x="480" y="100" fill="#5a5550" font-size="9" text-anchor="middle">暗部細節 ✓ 高光過曝 ✗</text>
  <text x="480" y="125" fill="#8a8580" font-size="8" text-anchor="middle">Exposure = T × R</text>
  <text x="480" y="140" fill="#8a8580" font-size="8" text-anchor="middle">拉亮暗部（室內/陰影）</text>
  <!-- Merge arrow -->
  <line x1="110" y1="165" x2="290" y2="195" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <line x1="290" y1="165" x2="290" y2="195" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <line x1="480" y1="165" x2="290" y2="195" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <!-- Merge block -->
  <rect x="180" y="200" width="220" height="45" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="290" y="220" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">HDR Merge / Fusion</text>
  <text x="290" y="237" fill="#5a5550" font-size="9" text-anchor="middle">Motion-adaptive Weighted Average</text>
  <line x1="290" y1="245" x2="290" y2="270" stroke="#5a5550" stroke-width="1" marker-end="url(#mcArr)"/>
  <!-- Tone mapping -->
  <rect x="180" y="275" width="220" height="45" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="290" y="295" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Local Tone Mapping</text>
  <text x="290" y="312" fill="#5a5550" font-size="9" text-anchor="middle">壓縮 HDR → SDR/Display</text>
</svg><div class="caption">圖 7-17：HDR 多曝光融合流程 — Short/Medium/Long Exposure 到 Tone Mapping</div></div>

<h3>Exposure Ratio Selection</h3>
<p>Exposure Ratio（曝光比）決定了 HDR 系統能捕捉的動態範圍擴展量：</p>
<ul>
  <li><strong>2-frame HDR</strong>：典型 Ratio 4:1 ~ 16:1，擴展 12-24 dB，適合中等 HDR 場景</li>
  <li><strong>3-frame HDR</strong>：典型 Ratio 1:4:16 或 1:8:64，擴展 24-36 dB，適合強逆光場景</li>
  <li><strong>Staggered HDR</strong>：多行交錯曝光，在單幀讀出時間內完成，減少 Motion Artifact</li>
</ul>

<p>Exposure Ratio 不是越大越好。過大的 Ratio 意味著 Short Exposure 太暗（暗部 SNR 極低），Long Exposure 太亮（更容易過曝和產生 Motion Blur），融合後的影像在中間過渡區域可能出現明顯的<strong>噪聲斷層</strong>。</p>

<h3>Ghost Handling（鬼影處理）</h3>
<p>多曝光 HDR 的最大敵人是<strong>場景運動和相機晃動</strong>造成的鬼影（Ghosting）。運動物體在不同曝光幀中位於不同位置，直接融合會產生半透明的重影。</p>
<ul>
  <li><strong>Global Motion Compensation</strong>：基於 Gyroscope 或 Image Registration 的全域位移校正</li>
  <li><strong>Motion Detection Map</strong>：逐像素比較不同曝光幀，偵測運動區域</li>
  <li><strong>Single-frame Fallback</strong>：在運動區域只使用一幀（通常是 Medium Exposure），放棄 HDR 效果</li>
  <li><strong>Confidence-based Fusion</strong>：根據運動可信度加權融合——靜止區域完整 HDR，運動區域偏向單幀</li>
</ul>

<h3>Local Contrast 調適</h3>
<p>HDR Tone Mapping 將高動態範圍壓縮到顯示範圍時，如果處理不當，影像會看起來<strong>扁平、缺乏對比</strong>。Local Contrast（局部對比度）的調適是讓 HDR 影像「看起來自然」的關鍵：</p>
<ul>
  <li><strong>Global Tone Curve</strong>：整體亮度壓縮，控制 Highlight/Shadow 的相對亮度關係</li>
  <li><strong>Local Tone Mapping</strong>：根據局部亮度環境調整對比，保留紋理細節</li>
  <li><strong>Adaptive Contrast</strong>：亮區適度壓縮、暗區適度提升，避免「HDR 感太重」的卡通效果</li>
  <li><strong>Halo Prevention</strong>：Local Tone Mapping 最常見的副作用是在高對比邊緣產生 Halo，需要精細調適邊緣保留濾波器的半徑和強度</li>
</ul>

<h3>Highlight / Shadow Balance</h3>
<p>HDR 場景的高光和暗部 balance 是主觀偏好問題，需要根據產品定位決定：</p>

<div class="table-container">
<table>
  <tr><th>風格</th><th>高光</th><th>暗部</th><th>適用場景</th></tr>
  <tr><td>自然保守</td><td>允許輕微過曝</td><td>保持較暗</td><td>專業相機、忠實還原</td></tr>
  <tr><td>平衡型</td><td>完整保留</td><td>適度提亮</td><td>旗艦手機主流風格</td></tr>
  <tr><td>計算攝影</td><td>強力壓制</td><td>大幅提亮</td><td>夜景模式、Google HDR+</td></tr>
  <tr><td>車用 ADAS</td><td>不可過曝</td><td>不可欠曝</td><td>安全優先的最大 DR</td></tr>
</table>
</div>

<div class="note">
  <strong>調適建議：</strong>HDR Tuning 務必在真實場景中測試，不要只看室內合成的 HDR Chart。真實場景中的光線分佈、運動物體和色彩複雜度遠超測試圖卡。建議至少覆蓋：室內窗邊逆光、隧道出入口、夜間車燈、舞台強光、日落逆光等 5 類典型場景。
</div>
`
    },
    {
      id: "ch7_18",
      title: "Video IQ vs Photo IQ",
      content: `
<h3>Video 和 Photo IQ 的根本差異</h3>
<p>許多 ISP 工程師在初次接觸 Video IQ Tuning 時，直覺地沿用 Photo 的參數。然而 Video 和 Photo 的 IQ 調適有<strong>根本性的差異</strong>，主要來自三個維度：<strong>時間連續性</strong>（Video 是連續幀序列）、<strong>處理時間約束</strong>（每幀必須在 frame interval 內完成）、以及<strong>觀看方式</strong>（Video 是動態觀看，Photo 是靜態放大檢視）。</p>

<p>簡單來說：Photo Tuning 追求「每一張都完美」，Video Tuning 追求「連續觀看流暢自然」。</p>

<div class="table-container">
<table>
  <tr><th>面向</th><th>Photo IQ</th><th>Video IQ</th></tr>
  <tr><td>觀看方式</td><td>靜態放大檢視</td><td>動態連續播放（不逐幀檢視）</td></tr>
  <tr><td>NR 策略</td><td>空間域 NR 為主</td><td>時間域 NR（TNR）為主</td></tr>
  <tr><td>Sharpening</td><td>可以較強</td><td>需要保守（避免閃爍）</td></tr>
  <tr><td>AE 響應</td><td>可以快速收斂</td><td>需要平滑過渡（避免亮度跳動）</td></tr>
  <tr><td>AWB 響應</td><td>可以快速切換</td><td>需要緩慢漸變（避免色溫突變）</td></tr>
  <tr><td>處理複雜度</td><td>不限（可離線）</td><td>受限於 Frame Rate（16ms@60fps）</td></tr>
  <tr><td>HDR</td><td>多帧融合自由</td><td>受限於 frame budget，通常 2-frame</td></tr>
</table>
</div>

<h3>Temporal Noise Reduction（TNR）</h3>
<p>TNR 是 Video NR 的核心。利用相鄰幀之間的時間冗餘來降噪，比空間域 NR 有更好的「降噪 vs 細節」trade-off：</p>
<ul>
  <li><strong>原理</strong>：對齊相鄰幀後，對靜止區域做時間軸上的平均/濾波，等效於多張融合</li>
  <li><strong>IIR Filter 形式</strong>：Output(t) = α × Input(t) + (1-α) × Output(t-1)，α 越小降噪越強</li>
  <li><strong>Motion-adaptive α</strong>：靜止區域 α 小（強降噪），運動區域 α 大（保持響應性），避免運動拖影</li>
  <li><strong>Recursive 結構的缺點</strong>：可能產生「殘影」（ghosting）——運動停止後，之前的融合殘留需要數幀才能消散</li>
</ul>

<h3>Frame Rate 對 IQ 的影響</h3>
<p>Video 的 Frame Rate 直接影響可用的曝光時間和處理預算：</p>
<ul>
  <li><strong>30fps</strong>：每幀最多 33ms 曝光，ISP 處理預算充裕</li>
  <li><strong>60fps</strong>：每幀最多 16ms 曝光，低光下 SNR 降低約 3dB，ISP 處理預算減半</li>
  <li><strong>120fps / 240fps（慢動作）</strong>：曝光時間極短，通常需要 Binning 模式 + 降低解析度，IQ 明顯下降</li>
  <li><strong>Variable Frame Rate（VFR）</strong>：低光下自動降低 Frame Rate 以增加曝光時間，需要注意播放兼容性</li>
</ul>

<h3>Rolling Shutter Artifact</h3>
<p>CMOS Sensor 普遍使用 Rolling Shutter（逐行曝光），在快速運動或相機快速搖擺時會產生斜切變形（Skew）和果凍效應（Jello）：</p>
<ul>
  <li><strong>Readout Time</strong>：從第一行到最後一行的時間差（通常 10-30ms），決定了 Rolling Shutter 嚴重程度</li>
  <li><strong>ISP 補償</strong>：利用 Gyroscope 數據和 Motion Estimation 在 ISP 中做行間位移補償</li>
  <li><strong>Sensor 層面</strong>：部分高階 Sensor 支援 DOL-HDR（Digital Overlap）或 Global Shutter 來從根本上消除</li>
</ul>

<h3>Video Stabilization Artifacts</h3>
<p>電子防手震（EIS）是 Video 必備功能，但會引入特定的 IQ Artifact：</p>
<ul>
  <li><strong>FOV 損失</strong>：EIS 需要裁切畫面邊緣作為補償餘量，有效 FOV 減少 10-15%</li>
  <li><strong>Warping Artifact</strong>：大幅度補償時，畫面邊緣可能出現拉伸變形</li>
  <li><strong>Rolling Shutter 校正與 EIS 的衝突</strong>：兩者都會修改 Geometric Mapping，需要統一處理</li>
  <li><strong>果凍效應殘留</strong>：EIS 可以補償平移，但對滾動快門的非線性畸變只能部分修正</li>
</ul>

<h3>Video AE/AWB 平滑策略</h3>
<p>Video 模式下，AE 和 AWB 的響應速度至關重要：</p>
<ul>
  <li><strong>AE 平滑</strong>：亮度變化時不能瞬間調整曝光（會導致閃爍），需要設定 convergence speed（如每幀最多調整 0.1 EV）</li>
  <li><strong>AWB 平滑</strong>：色溫變化時 AWB Gain 需要慢速過渡（如 200-500ms 的 low-pass filter），避免色溫跳動</li>
  <li><strong>場景切換偵測</strong>：快速搖鏡或場景大幅變化時，需要加速 AE/AWB 收斂，否則過渡太慢</li>
</ul>

<div class="note">
  <strong>實務要點：</strong>Video IQ 的主觀評價比 Photo 更依賴「動態觀看」——一定要在真正播放 Video 的狀態下評價，而不是逐幀截圖比較。很多在截圖中看起來「不完美」的處理（如輕微的 TNR 殘影），在連續播放中完全感覺不到。反之，截圖看起來很好的結果，播放時可能出現閃爍或跳動。
</div>
`
    },
    {
      id: "ch7_19",
      title: "ISP Register Dump 與分析",
      content: `
<h3>為什麼需要 Register Dump？</h3>
<p>ISP 硬體的所有行為都由<strong>寄存器（Register）</strong>控制。當影像品質出現問題時，「看看 ISP 現在的寄存器狀態」往往是最直接有效的 Debug 手段。<strong>Register Dump</strong>是指在運行時讀取 ISP 所有（或特定模組的）寄存器值，將其匯出為可分析的格式。</p>

<p>Register Dump 的價值在於：它告訴你「ISP 實際上在做什麼」，而不是「你以為它在做什麼」。很多 IQ 問題的根因是參數沒有正確地寫入 ISP——可能是軟體 Bug、時序問題、或者某個條件觸發了意外的參數覆蓋。</p>

<div class="diagram"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">ISP Register Dump Debug 流程</text>
  <defs>
    <marker id="rdArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
  </defs>
  <!-- Step 1 -->
  <rect x="30" y="50" width="120" height="65" rx="6" fill="rgba(196,64,64,0.12)" stroke="#c44040" stroke-width="1.5"/>
  <text x="90" y="70" fill="#c44040" font-size="10" text-anchor="middle" font-weight="500">IQ 問題出現</text>
  <text x="90" y="87" fill="#5a5550" font-size="8" text-anchor="middle">色偏 / 過曝 / 噪聲</text>
  <text x="90" y="101" fill="#5a5550" font-size="8" text-anchor="middle">紫邊 / 模糊 / Artifact</text>
  <line x1="150" y1="82" x2="175" y2="82" stroke="#5a5550" stroke-width="1.2" marker-end="url(#rdArr)"/>
  <!-- Step 2 -->
  <rect x="180" y="50" width="120" height="65" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="240" y="70" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">Register Dump</text>
  <text x="240" y="87" fill="#5a5550" font-size="8" text-anchor="middle">ADB / UART / JTAG</text>
  <text x="240" y="101" fill="#5a5550" font-size="8" text-anchor="middle">匯出全部 ISP 寄存器</text>
  <line x1="300" y1="82" x2="325" y2="82" stroke="#5a5550" stroke-width="1.2" marker-end="url(#rdArr)"/>
  <!-- Step 3 -->
  <rect x="330" y="50" width="120" height="65" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="390" y="70" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">解析與比對</text>
  <text x="390" y="87" fill="#5a5550" font-size="8" text-anchor="middle">Human-readable 格式</text>
  <text x="390" y="101" fill="#5a5550" font-size="8" text-anchor="middle">與預期值 Diff</text>
  <line x1="450" y1="82" x2="475" y2="82" stroke="#5a5550" stroke-width="1.2" marker-end="url(#rdArr)"/>
  <!-- Step 4 -->
  <rect x="480" y="50" width="95" height="65" rx="6" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="527" y="70" fill="#4a7ab5" font-size="10" text-anchor="middle" font-weight="500">根因定位</text>
  <text x="527" y="87" fill="#5a5550" font-size="8" text-anchor="middle">找到異常寄存器</text>
  <text x="527" y="101" fill="#5a5550" font-size="8" text-anchor="middle">追溯寫入來源</text>
  <!-- Common issues table -->
  <rect x="30" y="140" width="545" height="145" rx="6" fill="rgba(255,255,255,0.5)" stroke="#d5cec7" stroke-width="1"/>
  <text x="300" y="160" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">常見寄存器異常與對應 IQ 問題</text>
  <line x1="30" y1="170" x2="575" y2="170" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="110" y="185" fill="#c44040" font-size="9" text-anchor="middle" font-weight="500">AWB Gain 異常</text>
  <text x="110" y="200" fill="#5a5550" font-size="8" text-anchor="middle">R/B Gain 不合理 → 色偏</text>
  <text x="300" y="185" fill="#c4a064" font-size="9" text-anchor="middle" font-weight="500">CCM 未更新</text>
  <text x="300" y="200" fill="#5a5550" font-size="8" text-anchor="middle">還停在預設值 → 色彩失真</text>
  <text x="490" y="185" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">NR 強度過大</text>
  <text x="490" y="200" fill="#5a5550" font-size="8" text-anchor="middle">Filter 係數全開 → 蠟像感</text>
  <line x1="30" y1="210" x2="575" y2="210" stroke="#e0dbd5" stroke-width="0.5"/>
  <text x="110" y="225" fill="#4a7ab5" font-size="9" text-anchor="middle" font-weight="500">LSC Table 全零</text>
  <text x="110" y="240" fill="#5a5550" font-size="8" text-anchor="middle">未載入 → 暗角明顯</text>
  <text x="300" y="225" fill="#c44040" font-size="9" text-anchor="middle" font-weight="500">Gamma LUT 錯誤</text>
  <text x="300" y="240" fill="#5a5550" font-size="8" text-anchor="middle">線性 Gamma → 影像過暗</text>
  <text x="490" y="225" fill="#c4a064" font-size="9" text-anchor="middle" font-weight="500">DPC 未啟用</text>
  <text x="490" y="240" fill="#5a5550" font-size="8" text-anchor="middle">Enable bit = 0 → 亮點可見</text>
  <line x1="30" y1="250" x2="575" y2="250" stroke="#e0dbd5" stroke-width="0.5"/>
  <text x="110" y="265" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">AE Target 異常</text>
  <text x="110" y="278" fill="#5a5550" font-size="8" text-anchor="middle">Target 太高 → 過曝</text>
  <text x="300" y="265" fill="#4a7ab5" font-size="9" text-anchor="middle" font-weight="500">Crop 座標錯誤</text>
  <text x="300" y="278" fill="#5a5550" font-size="8" text-anchor="middle">偏移 → 畫面位置不對</text>
  <text x="490" y="265" fill="#c44040" font-size="9" text-anchor="middle" font-weight="500">HDR Ratio 不匹配</text>
  <text x="490" y="278" fill="#5a5550" font-size="8" text-anchor="middle">Merge 參數錯 → HDR 融合失敗</text>
</svg><div class="caption">圖 7-19：Register Dump Debug 流程與常見寄存器異常對照</div></div>

<h3>Reading ISP State</h3>
<p>讀取 ISP 寄存器的常用方法：</p>
<ul>
  <li><strong>ADB Shell（Android）</strong>：<code>adb shell cat /sys/kernel/debug/ispX/register_dump</code> 或廠商專屬的 debugfs 節點</li>
  <li><strong>Vendor Tool</strong>：Qualcomm CamX Log、MediaTek ISP Tuning Tool、Samsung LSI Debug Tool 等</li>
  <li><strong>JTAG/SWD</strong>：直接透過調試介面讀取 Memory-mapped Register，適合底層 debug</li>
  <li><strong>UART Log</strong>：在 ISP Driver 中加入 Register Dump 功能，透過串口輸出</li>
</ul>

<h3>Parameter Verification</h3>
<p>驗證參數是否正確寫入的方法論：</p>
<ol>
  <li><strong>比對 Golden File</strong>：將 Dump 出的值與預期的參數檔比對，找出差異</li>
  <li><strong>關注 Shadow Register</strong>：很多 ISP 使用 Shadow/Active 雙寄存器機制，需要確認寫入的是 Shadow，且在 VSync 後已切換到 Active</li>
  <li><strong>時序驗證</strong>：某些參數需要在特定時序寫入（如 Frame Boundary），錯誤的時序可能導致參數被忽略或只部分生效</li>
  <li><strong>自動化驗證腳本</strong>：編寫腳本定期 Dump + 比對，作為 CI 的一部分</li>
</ol>

<h3>Debug Methodology</h3>
<p>系統化的 ISP Debug 方法論：</p>
<ul>
  <li><strong>Bypass 法</strong>：逐個 Bypass ISP 模組（NR off → Sharpening off → CCM bypass...），找出是哪個模組引入的問題</li>
  <li><strong>A/B 比對</strong>：在「好的版本」和「壞的版本」各做一次 Register Dump，比對兩者差異</li>
  <li><strong>RAW + Processed 同時儲存</strong>：如果 RAW 影像正常但 Processed 異常，問題在 ISP；如果 RAW 就異常，問題在 Sensor</li>
  <li><strong>Golden Register Set</strong>：維護一組「已知正確」的寄存器配置，可快速恢復到已知良好狀態</li>
</ul>

<h3>Common Misconfigurations</h3>
<p>實務中最常見的寄存器配置錯誤：</p>
<ul>
  <li><strong>Module Enable Bit 未開</strong>：參數都正確但模組未啟用，等於白設</li>
  <li><strong>Address Offset 錯誤</strong>：寫入了錯誤的地址，導致 A 模組的參數被寫到 B 模組</li>
  <li><strong>Endianness 錯誤</strong>：大小端不匹配，參數值完全錯亂</li>
  <li><strong>Signed/Unsigned 混淆</strong>：CCM 矩陣的負值係數被當作大正值解讀</li>
  <li><strong>Fixed-point 格式錯誤</strong>：4.8 格式的值被當作 8.4 或 Integer 格式寫入</li>
</ul>

<div class="note">
  <strong>Debug 建議：</strong>養成「出問題就先 Dump Register」的習慣。80% 的 IQ 問題可以通過 Register Dump 在 30 分鐘內定位根因。建議開發一個 Register Dump 解析工具，將十六進制值轉為 human-readable 的參數名稱和物理意義，大幅提升 Debug 效率。
</div>
`
    },
    {
      id: "ch7_20",
      title: "IQ KPI 定義與追蹤",
      content: `
<h3>為什麼需要 IQ KPI？</h3>
<p>在 ISP 開發和產品迭代中，「IQ 好不好」不能只是模糊的感受——它需要被<strong>量化、追蹤和管理</strong>。IQ KPI（Key Performance Indicator）就是將影像品質轉化為可量測的數字指標，讓團隊能夠客觀地評估 IQ 狀態、追蹤歷史趨勢、設定改進目標。</p>

<p>沒有 KPI 的 IQ 管理就像沒有儀表板的飛行——你可能覺得一切正常，但無法確認是否真的在正確的航線上。KPI 讓 IQ 管理從「藝術」變成「工程」。</p>

<div class="diagram"><svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="380" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">IQ KPI Dashboard 架構</text>
  <!-- Categories -->
  <rect x="25" y="45" width="170" height="155" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="110" y="65" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">客觀指標（Objective）</text>
  <text x="40" y="85" fill="#5a5550" font-size="9">• Sharpness (MTF50)</text>
  <text x="40" y="100" fill="#5a5550" font-size="9">• Color Accuracy (ΔE)</text>
  <text x="40" y="115" fill="#5a5550" font-size="9">• Noise (SNR@18%)</text>
  <text x="40" y="130" fill="#5a5550" font-size="9">• Dynamic Range (dB)</text>
  <text x="40" y="145" fill="#5a5550" font-size="9">• Distortion (%)</text>
  <text x="40" y="160" fill="#5a5550" font-size="9">• AWB Error (ΔCT)</text>
  <text x="40" y="175" fill="#5a5550" font-size="9">• AE Accuracy (±EV)</text>
  <text x="40" y="190" fill="#5a5550" font-size="9">• Lens Shading (%)</text>
  <rect x="215" y="45" width="170" height="155" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="300" y="65" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">主觀指標（Subjective）</text>
  <text x="230" y="85" fill="#5a5550" font-size="9">• Overall IQ Score (1-10)</text>
  <text x="230" y="100" fill="#5a5550" font-size="9">• Skin Tone Preference</text>
  <text x="230" y="115" fill="#5a5550" font-size="9">• Detail Preservation</text>
  <text x="230" y="130" fill="#5a5550" font-size="9">• Noise Perception</text>
  <text x="230" y="145" fill="#5a5550" font-size="9">• Color Preference</text>
  <text x="230" y="160" fill="#5a5550" font-size="9">• HDR Naturalness</text>
  <text x="230" y="175" fill="#5a5550" font-size="9">• Artifact Severity</text>
  <text x="230" y="190" fill="#5a5550" font-size="9">• Bokeh Quality</text>
  <rect x="405" y="45" width="170" height="155" rx="6" fill="rgba(74,122,181,0.08)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="490" y="65" fill="#4a7ab5" font-size="11" text-anchor="middle" font-weight="500">競品指標（Competitive）</text>
  <text x="420" y="85" fill="#5a5550" font-size="9">• DxOMark Score</text>
  <text x="420" y="100" fill="#5a5550" font-size="9">• Blind Test Win Rate</text>
  <text x="420" y="115" fill="#5a5550" font-size="9">• Feature Parity</text>
  <text x="420" y="130" fill="#5a5550" font-size="9">• Scene Coverage</text>
  <text x="420" y="145" fill="#5a5550" font-size="9">• Use Case Score</text>
  <text x="420" y="160" fill="#5a5550" font-size="9">• Low-light Ranking</text>
  <text x="420" y="175" fill="#5a5550" font-size="9">• Video Quality Rank</text>
  <text x="420" y="190" fill="#5a5550" font-size="9">• Zoom Quality Rank</text>
  <!-- Dashboard visualization -->
  <rect x="25" y="215" width="550" height="150" rx="6" fill="rgba(255,255,255,0.5)" stroke="#d5cec7" stroke-width="1"/>
  <text x="300" y="235" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">IQ Dashboard — 趨勢追蹤</text>
  <!-- Trend line simulation -->
  <line x1="55" y1="340" x2="555" y2="340" stroke="#d5cec7" stroke-width="1"/>
  <line x1="55" y1="250" x2="55" y2="340" stroke="#d5cec7" stroke-width="1"/>
  <text x="55" y="355" fill="#8a8580" font-size="8" text-anchor="middle">v1.0</text>
  <text x="155" y="355" fill="#8a8580" font-size="8" text-anchor="middle">v1.1</text>
  <text x="255" y="355" fill="#8a8580" font-size="8" text-anchor="middle">v1.2</text>
  <text x="355" y="355" fill="#8a8580" font-size="8" text-anchor="middle">v2.0</text>
  <text x="455" y="355" fill="#8a8580" font-size="8" text-anchor="middle">v2.1</text>
  <text x="555" y="355" fill="#8a8580" font-size="8" text-anchor="middle">v2.2</text>
  <!-- MTF trend -->
  <polyline points="55,310 155,300 255,290 355,280 455,275 555,270" fill="none" stroke="#c4a064" stroke-width="1.5"/>
  <text x="560" y="268" fill="#c4a064" font-size="8">MTF50</text>
  <!-- SNR trend -->
  <polyline points="55,320 155,315 255,305 355,310 455,295 555,285" fill="none" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="560" y="283" fill="#6a8a7a" font-size="8">SNR</text>
  <!-- Color accuracy trend -->
  <polyline points="55,305 155,295 255,300 355,285 455,280 555,275" fill="none" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="560" y="278" fill="#4a7ab5" font-size="8">ΔE</text>
  <!-- Regression alert -->
  <circle cx="355" cy="310" r="8" fill="none" stroke="#c44040" stroke-width="1.5"/>
  <text x="355" y="313" fill="#c44040" font-size="8" text-anchor="middle">!</text>
  <text x="390" y="325" fill="#c44040" font-size="7">SNR 回退 alert</text>
</svg><div class="caption">圖 7-20：IQ KPI Dashboard — 客觀/主觀/競品三大維度的指標追蹤與趨勢可視化</div></div>

<h3>Defining IQ Metrics</h3>
<p>好的 IQ KPI 需要滿足 <strong>SMART 原則</strong>：</p>
<ul>
  <li><strong>Specific</strong>：指標定義精確，如「MTF50 at image center, measured on SFR+ chart at D65 300 lux」</li>
  <li><strong>Measurable</strong>：有明確的量測方法和工具</li>
  <li><strong>Achievable</strong>：目標值在物理和技術上可達</li>
  <li><strong>Relevant</strong>：與使用者感受有相關性（純技術指標不一定反映真實 IQ 體驗）</li>
  <li><strong>Time-bound</strong>：有明確的達標時程</li>
</ul>

<h3>Tracking Dashboards</h3>
<p>IQ Dashboard 的設計原則：</p>
<ul>
  <li><strong>一頁總覽</strong>：最重要的 5-8 個 KPI 在首頁以儀表板形式呈現，紅/黃/綠 狀態一目了然</li>
  <li><strong>歷史趨勢</strong>：每個指標的歷史趨勢圖，可追溯到過去 6-12 個月</li>
  <li><strong>版本標記</strong>：在趨勢圖上標記每次重要的軟體/參數版本更新</li>
  <li><strong>A/B 比較</strong>：可選擇任意兩個版本做並排比較</li>
  <li><strong>鑽取功能</strong>：從總覽可鑽取到具體場景、具體 ISO 的詳細數據</li>
</ul>

<h3>Regression Alerts</h3>
<p>自動化的品質回退警報機制：</p>
<ul>
  <li><strong>絕對閾值</strong>：指標超出規格範圍立即告警（如 ΔE > 5.0 → Red Alert）</li>
  <li><strong>相對變化</strong>：與前一版本相比惡化超過 N% 告警（如 MTF50 下降 > 5% → Yellow Alert）</li>
  <li><strong>趨勢偵測</strong>：指標連續 3 個版本同方向惡化 → Trend Alert</li>
  <li><strong>通知渠道</strong>：Email、Slack/Teams、JIRA 自動建 Bug Ticket</li>
</ul>

<h3>Competitive Benchmarking Methodology</h3>
<p>與競品的 IQ 比較是產品定位的重要參考：</p>
<ul>
  <li><strong>場景選擇</strong>：至少覆蓋 20 個典型場景（日光、室內、低光、逆光、人像、風景、微距、夜景等）</li>
  <li><strong>拍攝條件控制</strong>：所有機器在同一場景、同一時間拍攝，使用固定腳架確保構圖一致</li>
  <li><strong>Blind Test</strong>：將不同機器的照片打亂編號，由 10+ 人做盲測偏好評分</li>
  <li><strong>客觀量測</strong>：同時用 Imatest 等工具做客觀量測，與主觀結果交叉驗證</li>
  <li><strong>定期更新</strong>：競品出新版本/新機型時需要重新 Benchmark</li>
</ul>

<div class="note">
  <strong>KPI 管理建議：</strong>不要追蹤太多指標——5-8 個核心 KPI 足以涵蓋關鍵的 IQ 維度。太多指標反而導致團隊失焦。核心 KPI 建議：MTF50（銳度）、ΔE2000（色準）、SNR@18%（噪聲）、DR（動態範圍）、AWB Accuracy（白平衡準確度）、Overall Subjective Score（綜合主觀分）。
</div>
`
    },
    {
      id: "ch7_21",
      title: "量產 IQ 校正流程",
      content: `
<h3>為什麼量產需要 IQ 校正？</h3>
<p>在實驗室中用一顆模組精心 Tuning 出的 ISP 參數，直接套用到量產的每顆模組上，IQ 可能會有明顯差異。原因是<strong>模組個體差異</strong>：每顆鏡頭的焦距、光圈、MTF 略有不同；每顆 Sensor 的靈敏度、暗電流、缺陷像素不同；組裝的偏心和傾斜也不同。</p>

<p><strong>量產 IQ 校正（Production Calibration）</strong>的目標是：在產線上快速量測每顆模組的個體差異，並產生模組專屬的校正參數，使每顆出廠的模組都能達到一致的 IQ 水準。</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">量產 IQ 校正產線流程</text>
  <defs>
    <marker id="prodArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
  </defs>
  <!-- Station 1 -->
  <rect x="25" y="50" width="105" height="90" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="77" y="70" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">Station 1</text>
  <text x="77" y="85" fill="#5a5550" font-size="9" text-anchor="middle">BLC 校正</text>
  <text x="77" y="100" fill="#5a5550" font-size="8" text-anchor="middle">遮光拍攝</text>
  <text x="77" y="115" fill="#5a5550" font-size="8" text-anchor="middle">Dark Current</text>
  <text x="77" y="130" fill="#8a8580" font-size="7" text-anchor="middle">~5 sec/unit</text>
  <line x1="130" y1="95" x2="148" y2="95" stroke="#5a5550" stroke-width="1.2" marker-end="url(#prodArr)"/>
  <!-- Station 2 -->
  <rect x="153" y="50" width="105" height="90" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="205" y="70" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">Station 2</text>
  <text x="205" y="85" fill="#5a5550" font-size="9" text-anchor="middle">LSC 校正</text>
  <text x="205" y="100" fill="#5a5550" font-size="8" text-anchor="middle">均勻光源拍攝</text>
  <text x="205" y="115" fill="#5a5550" font-size="8" text-anchor="middle">Mesh Grid 計算</text>
  <text x="205" y="130" fill="#8a8580" font-size="7" text-anchor="middle">~8 sec/unit</text>
  <line x1="258" y1="95" x2="276" y2="95" stroke="#5a5550" stroke-width="1.2" marker-end="url(#prodArr)"/>
  <!-- Station 3 -->
  <rect x="281" y="50" width="105" height="90" rx="6" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="333" y="70" fill="#4a7ab5" font-size="10" text-anchor="middle" font-weight="500">Station 3</text>
  <text x="333" y="85" fill="#5a5550" font-size="9" text-anchor="middle">AWB / Color</text>
  <text x="333" y="100" fill="#5a5550" font-size="8" text-anchor="middle">色溫校正拍攝</text>
  <text x="333" y="115" fill="#5a5550" font-size="8" text-anchor="middle">AWB Gain 計算</text>
  <text x="333" y="130" fill="#8a8580" font-size="7" text-anchor="middle">~10 sec/unit</text>
  <line x1="386" y1="95" x2="404" y2="95" stroke="#5a5550" stroke-width="1.2" marker-end="url(#prodArr)"/>
  <!-- Station 4 -->
  <rect x="409" y="50" width="105" height="90" rx="6" fill="rgba(196,64,64,0.12)" stroke="#c44040" stroke-width="1.5"/>
  <text x="461" y="70" fill="#c44040" font-size="10" text-anchor="middle" font-weight="500">Station 4</text>
  <text x="461" y="85" fill="#5a5550" font-size="9" text-anchor="middle">OTP 燒錄</text>
  <text x="461" y="100" fill="#5a5550" font-size="8" text-anchor="middle">寫入校正數據</text>
  <text x="461" y="115" fill="#5a5550" font-size="8" text-anchor="middle">Verify Read-back</text>
  <text x="461" y="130" fill="#8a8580" font-size="7" text-anchor="middle">~3 sec/unit</text>
  <line x1="514" y1="95" x2="527" y2="95" stroke="#5a5550" stroke-width="1.2" marker-end="url(#prodArr)"/>
  <!-- Final QC -->
  <rect x="530" y="50" width="50" height="90" rx="6" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="555" y="80" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">QC</text>
  <text x="555" y="95" fill="#5a5550" font-size="7" text-anchor="middle">最終</text>
  <text x="555" y="107" fill="#5a5550" font-size="7" text-anchor="middle">驗證</text>
  <!-- OTP detail -->
  <rect x="25" y="165" width="555" height="80" rx="6" fill="rgba(255,255,255,0.5)" stroke="#d5cec7" stroke-width="1"/>
  <text x="300" y="185" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">OTP Memory Layout（典型）</text>
  <rect x="40" y="200" width="80" height="30" rx="3" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1"/>
  <text x="80" y="219" fill="#5a5550" font-size="8" text-anchor="middle">BLC Offset</text>
  <rect x="130" y="200" width="120" height="30" rx="3" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="190" y="219" fill="#5a5550" font-size="8" text-anchor="middle">LSC Mesh (R/Gr/Gb/B)</text>
  <rect x="260" y="200" width="80" height="30" rx="3" fill="rgba(74,122,181,0.15)" stroke="#4a7ab5" stroke-width="1"/>
  <text x="300" y="219" fill="#5a5550" font-size="8" text-anchor="middle">AWB Golden</text>
  <rect x="350" y="200" width="80" height="30" rx="3" fill="rgba(196,64,64,0.15)" stroke="#c44040" stroke-width="1"/>
  <text x="390" y="219" fill="#5a5550" font-size="8" text-anchor="middle">DPC Table</text>
  <rect x="440" y="200" width="60" height="30" rx="3" fill="rgba(196,160,100,0.10)" stroke="#d5cec7" stroke-width="1"/>
  <text x="470" y="219" fill="#5a5550" font-size="8" text-anchor="middle">Module ID</text>
  <rect x="510" y="200" width="60" height="30" rx="3" fill="rgba(196,160,100,0.10)" stroke="#d5cec7" stroke-width="1"/>
  <text x="540" y="219" fill="#5a5550" font-size="8" text-anchor="middle">Checksum</text>
  <!-- Yield info -->
  <rect x="25" y="265" width="555" height="70" rx="6" fill="rgba(106,138,122,0.06)" stroke="#d5cec7" stroke-width="1"/>
  <text x="300" y="285" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">良率影響因素</text>
  <text x="120" y="305" fill="#c44040" font-size="9" text-anchor="middle">DPC 超標：3-5% fail</text>
  <text x="300" y="305" fill="#c4a064" font-size="9" text-anchor="middle">LSC 不均：1-3% fail</text>
  <text x="480" y="305" fill="#4a7ab5" font-size="9" text-anchor="middle">Color 偏差：1-2% fail</text>
  <text x="300" y="325" fill="#6a8a7a" font-size="10" text-anchor="middle">典型產線良率目標：≥ 95%（含所有校正站）</text>
</svg><div class="caption">圖 7-21：量產 IQ 校正流程 — 四個校正站到 OTP 燒錄的完整產線</div></div>

<h3>Factory Calibration Flow</h3>
<p>典型的相機模組產線 IQ 校正流程包含以下站位：</p>
<ol>
  <li><strong>BLC Station</strong>：在遮光環境下拍攝 Dark Frame，計算每個 Channel 的 Black Level Offset</li>
  <li><strong>LSC Station</strong>：在積分球或均勻光箱前拍攝 Flat Field，生成 per-unit 的 Shading Mesh Grid</li>
  <li><strong>AWB/Color Station</strong>：在標準光源下拍攝灰卡或 ColorChecker，校正 AWB Golden Gain 和 Color 偏差</li>
  <li><strong>DPC Station</strong>：拍攝 Dark Frame 和 Bright Frame，偵測並記錄 Defect Pixel 座標列表</li>
  <li><strong>OTP Programming</strong>：將所有校正數據寫入 Sensor 的 OTP（One-Time Programmable）memory</li>
  <li><strong>Final QC</strong>：讀回 OTP 數據驗證，拍攝 IQ 驗證影像確認校正效果</li>
</ol>

<h3>OTP Programming</h3>
<p>OTP（One-Time Programmable）memory 是 CMOS Sensor 內建的非易失性記憶體，用於存儲模組專屬的校正數據：</p>
<ul>
  <li><strong>容量限制</strong>：典型 OTP 容量 1-16 KB，需要精心規劃 Layout</li>
  <li><strong>一次寫入</strong>：OTP 只能寫一次（或有限的幾次），寫入後無法修改，失誤代價極高</li>
  <li><strong>Verify 流程</strong>：寫入後必須立即讀回比對，確保數據正確</li>
  <li><strong>Checksum</strong>：存入 CRC/Checksum，ISP Driver 讀取時驗證數據完整性</li>
  <li><strong>版本管理</strong>：OTP Layout 需要版本號，確保不同版本的 Driver 能正確解析</li>
</ul>

<h3>Module-level Compensation</h3>
<p>除了 Sensor 層面的校正，模組組裝也會引入需要補償的差異：</p>
<ul>
  <li><strong>光軸偏移</strong>：鏡頭組裝偏心導致 Shading Center 偏移，LSC Mesh Grid 需要調整中心點</li>
  <li><strong>傾斜（Tilt）</strong>：鏡頭與 Sensor 平面不平行，導致一側對焦清晰另一側模糊，需要 AF 校正</li>
  <li><strong>焦距差異</strong>：鏡頭個體焦距差異影響 FOV 和對焦距離，需要 AF Offset 校正</li>
  <li><strong>光圈差異</strong>：實際 F-number 與標稱值的偏差影響 AE 準確度</li>
</ul>

<h3>Yield Optimization</h3>
<p>產線良率直接影響生產成本和交貨週期。IQ 校正相關的良率優化策略：</p>
<ul>
  <li><strong>放寬校正規格</strong>：在不影響最終 IQ 的前提下，適度放寬 Pass/Fail 閾值</li>
  <li><strong>補償更多項目</strong>：原本用 Golden Sample 的項目改為 Per-unit 校正，容忍更大的個體差異</li>
  <li><strong>Re-test 機制</strong>：首次校正失敗的模組允許重測一次（可能是治具接觸不良等偶發原因）</li>
  <li><strong>數據分析</strong>：分析失敗模組的分佈規律，反饋給模組供應商改善來料品質</li>
  <li><strong>Cycle Time 優化</strong>：校正站的處理時間直接影響產能，需要持續優化演算法和設備效率</li>
</ul>

<div class="note">
  <strong>量產提醒：</strong>產線 IQ 校正的 Cycle Time（單顆模組處理時間）通常需要控制在 30 秒以內才能滿足量產需求。每減少 1 秒的 Cycle Time，在百萬量級的產量中都意味著顯著的產能提升。建議在開發階段就考慮校正演算法的計算效率。
</div>
`
    },
    {
      id: "ch7_22",
      title: "AI-based IQ 評估與趨勢",
      content: `
<h3>AI 在 IQ 評估中的角色</h3>
<p>傳統的 IQ 評估依賴<strong>客觀指標</strong>（如 MTF、SNR、ΔE）和<strong>主觀評分</strong>（人工評測）。然而客觀指標不一定與人類感知完全對齊——MTF 高的影像不一定「好看」，SNR 低的影像在某些風格下反而有氛圍感。主觀評測則昂貴、耗時且不可重複。</p>

<p><strong>AI-based IQ 評估</strong>試圖結合兩者的優勢：用深度學習模型模擬人類的視覺感知，實現<strong>可重複、可擴展、與人類感知高度相關</strong>的 IQ 評估。這是近年 ISP 領域的重要趨勢之一。</p>

<div class="diagram"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="340" fill="#f5f0eb" rx="8"/>
  <text x="300" y="24" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">AI-based IQ 評估與 Neural ISP 趨勢</text>
  <defs>
    <marker id="aiArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
  </defs>
  <!-- Traditional -->
  <rect x="25" y="45" width="170" height="120" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="110" y="65" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">傳統 IQ 評估</text>
  <text x="40" y="85" fill="#5a5550" font-size="9">客觀指標（MTF/SNR/ΔE）</text>
  <text x="50" y="100" fill="#8a8580" font-size="8">✓ 可重複、精確</text>
  <text x="50" y="113" fill="#c44040" font-size="8">✗ 不完全反映人眼感知</text>
  <line x1="40" y1="122" x2="180" y2="122" stroke="#e0dbd5" stroke-width="0.5"/>
  <text x="40" y="137" fill="#5a5550" font-size="9">主觀評測（MOS Score）</text>
  <text x="50" y="150" fill="#8a8580" font-size="8">✓ 直接反映感知偏好</text>
  <text x="50" y="163" fill="#c44040" font-size="8">✗ 昂貴、耗時、不可完全重複</text>
  <!-- AI-based -->
  <rect x="215" y="45" width="170" height="120" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="300" y="65" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">AI IQ 評估</text>
  <text x="230" y="85" fill="#5a5550" font-size="9">Perceptual Quality Model</text>
  <text x="240" y="100" fill="#8a8580" font-size="8">✓ 模擬人眼感知</text>
  <text x="240" y="113" fill="#8a8580" font-size="8">✓ 可重複、可擴展</text>
  <text x="240" y="126" fill="#8a8580" font-size="8">✓ 不需要 Reference</text>
  <text x="240" y="139" fill="#c44040" font-size="8">✗ 需要大量訓練數據</text>
  <text x="240" y="152" fill="#c44040" font-size="8">✗ 可能有 Domain Gap</text>
  <!-- Neural ISP -->
  <rect x="405" y="45" width="170" height="120" rx="6" fill="rgba(74,122,181,0.08)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="490" y="65" fill="#4a7ab5" font-size="11" text-anchor="middle" font-weight="500">Neural ISP</text>
  <text x="420" y="85" fill="#5a5550" font-size="9">端到端 Learned ISP</text>
  <text x="430" y="100" fill="#8a8580" font-size="8">✓ 自動學習最佳處理</text>
  <text x="430" y="113" fill="#8a8580" font-size="8">✓ 超越手動 Tuning 上限</text>
  <text x="430" y="126" fill="#c44040" font-size="8">✗ 硬體部署困難</text>
  <text x="430" y="139" fill="#c44040" font-size="8">✗ 可解釋性差</text>
  <text x="430" y="152" fill="#c44040" font-size="8">✗ 功耗和延遲挑戰</text>
  <!-- Evolution arrows -->
  <line x1="195" y1="105" x2="213" y2="105" stroke="#5a5550" stroke-width="1.2" marker-end="url(#aiArr)"/>
  <line x1="385" y1="105" x2="403" y2="105" stroke="#5a5550" stroke-width="1.2" marker-end="url(#aiArr)"/>
  <!-- Timeline -->
  <rect x="25" y="190" width="550" height="130" rx="6" fill="rgba(255,255,255,0.5)" stroke="#d5cec7" stroke-width="1"/>
  <text x="300" y="210" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">技術演進時間線</text>
  <line x1="55" y1="260" x2="555" y2="260" stroke="#d5cec7" stroke-width="1.5"/>
  <!-- Milestones -->
  <circle cx="80" cy="260" r="5" fill="#c4a064"/>
  <text x="80" y="250" fill="#c4a064" font-size="8" text-anchor="middle">2015</text>
  <text x="80" y="280" fill="#5a5550" font-size="7" text-anchor="middle">NIQE/BRISQUE</text>
  <text x="80" y="290" fill="#8a8580" font-size="7" text-anchor="middle">手工特徵 NR-IQA</text>
  <circle cx="180" cy="260" r="5" fill="#6a8a7a"/>
  <text x="180" y="250" fill="#6a8a7a" font-size="8" text-anchor="middle">2018</text>
  <text x="180" y="280" fill="#5a5550" font-size="7" text-anchor="middle">CNN-based IQA</text>
  <text x="180" y="290" fill="#8a8580" font-size="7" text-anchor="middle">深度學習品質評估</text>
  <circle cx="280" cy="260" r="5" fill="#4a7ab5"/>
  <text x="280" y="250" fill="#4a7ab5" font-size="8" text-anchor="middle">2020</text>
  <text x="280" y="280" fill="#5a5550" font-size="7" text-anchor="middle">Learned ISP</text>
  <text x="280" y="290" fill="#8a8580" font-size="7" text-anchor="middle">RAW→RGB 端到端</text>
  <circle cx="380" cy="260" r="5" fill="#c44040"/>
  <text x="380" y="250" fill="#c44040" font-size="8" text-anchor="middle">2023</text>
  <text x="380" y="280" fill="#5a5550" font-size="7" text-anchor="middle">LLM + IQ</text>
  <text x="380" y="290" fill="#8a8580" font-size="7" text-anchor="middle">多模態品質理解</text>
  <circle cx="480" cy="260" r="5" fill="#c4a064"/>
  <text x="480" y="250" fill="#c4a064" font-size="8" text-anchor="middle">2025+</text>
  <text x="480" y="280" fill="#5a5550" font-size="7" text-anchor="middle">Edge Neural ISP</text>
  <text x="480" y="290" fill="#8a8580" font-size="7" text-anchor="middle">端側即時 AI ISP</text>
  <text x="480" y="300" fill="#6a8a7a" font-size="7" text-anchor="middle">NPU 加速部署</text>
</svg><div class="caption">圖 7-22：從傳統 IQ 評估到 AI IQ 評估和 Neural ISP 的技術演進</div></div>

<h3>Perceptual Quality Models</h3>
<p>感知品質模型試圖量化「人眼覺得好不好」的主觀感受。主流方法包括：</p>
<ul>
  <li><strong>Full-Reference（FR）</strong>：有 Reference 影像時使用，如 SSIM、LPIPS、DISTS。LPIPS 使用預訓練 CNN 特徵比較，與人類感知相關性很高</li>
  <li><strong>No-Reference（NR）</strong>：無 Reference 時使用（更接近實際應用場景），如 NIQE、BRISQUE、MUSIQ、CLIP-IQA</li>
  <li><strong>Distribution-based</strong>：評估整批影像的品質分佈而非單張，如 FID、KID</li>
  <li><strong>Multi-task Models</strong>：同時預測多個 IQ 維度（銳度、噪聲、色彩、曝光等）的綜合模型</li>
</ul>

<h3>No-Reference Metrics（NR-IQA）</h3>
<p>NR-IQA 在 ISP 開發中特別有價值——因為我們通常沒有「完美的 Reference 影像」：</p>

<div class="table-container">
<table>
  <tr><th>方法</th><th>原理</th><th>特點</th></tr>
  <tr><td><strong>NIQE</strong></td><td>基於自然場景統計（NSS），不需訓練</td><td>通用但粗糙，對 ISP 特定 artifact 不敏感</td></tr>
  <tr><td><strong>BRISQUE</strong></td><td>NSS 特徵 + SVR 回歸</td><td>需要少量標註數據訓練</td></tr>
  <tr><td><strong>MUSIQ</strong></td><td>Multi-scale Vision Transformer</td><td>支持任意解析度輸入，精度高</td></tr>
  <tr><td><strong>CLIP-IQA</strong></td><td>CLIP 視覺語言模型適配</td><td>可用文字描述定義品質維度</td></tr>
  <tr><td><strong>Q-Align</strong></td><td>Large Multimodal Model 評分</td><td>最接近人類評價，但計算量大</td></tr>
</table>
</div>

<h3>Learned ISP（端到端學習 ISP）</h3>
<p>Learned ISP 是一個更激進的趨勢——不只用 AI 評估 IQ，而是直接用神經網路取代傳統 ISP Pipeline：</p>
<ul>
  <li><strong>RAW-to-RGB 網路</strong>：輸入 RAW Bayer 影像，直接輸出處理好的 RGB 影像，跳過傳統的 Demosaic → AWB → CCM → Gamma → NR → Sharpen 等步驟</li>
  <li><strong>優勢</strong>：可以學到超越手動 Tuning 的處理效果，特別是在複雜場景中</li>
  <li><strong>挑戰</strong>：計算量大（需要 NPU/GPU 支援）、延遲高、功耗大、可解釋性差、訓練數據需求大</li>
  <li><strong>混合方案</strong>：將 Neural Network 用於 ISP 的特定模組（如 NR、HDR Merge），而非完全取代</li>
</ul>

<h3>Neural ISP 的產業化趨勢</h3>
<p>Neural ISP 從學術研究走向產業應用的路徑：</p>
<ul>
  <li><strong>2020-2022</strong>：學術界提出多種 RAW-to-RGB 網路架構（如 PyNet、MW-ISPNet）</li>
  <li><strong>2022-2024</strong>：手機 SoC 廠商在 NPU 上部署輕量級 Neural ISP 模組（如用於 Night Mode）</li>
  <li><strong>2024-2025</strong>：更多 ISP 功能被 Neural Network 取代，如 AI-based AWB、AI-based NR</li>
  <li><strong>2025+</strong>：端側 Neural ISP 在低功耗約束下的實時運行，需要 ISP 硬體和 NPU 的深度整合</li>
</ul>

<h3>AI IQ 評估在 ISP 開發中的應用</h3>
<p>AI-based IQ 評估的實際應用場景：</p>
<ul>
  <li><strong>自動化 IQ Regression</strong>：用 NR-IQA 模型自動評估每次版本更新的 IQ 變化，取代部分人工評測</li>
  <li><strong>IQ Tuning 指引</strong>：用 Perceptual Model 的梯度資訊指導 ISP 參數搜尋方向</li>
  <li><strong>A/B Test 規模化</strong>：快速評估大量 Tuning 變體的 IQ 品質，縮短迭代週期</li>
  <li><strong>場景自適應</strong>：Runtime 用輕量級 IQA 模型偵測當前場景的 IQ 狀態，自動調整 ISP 參數</li>
</ul>

<div class="note">
  <strong>趨勢觀察：</strong>AI 不會完全取代傳統 ISP——至少在未來 5-10 年內，硬體 ISP Pipeline 仍然是主流。但 AI 將越來越多地輔助和增強 ISP 的各個環節：從 IQ 評估、參數搜尋、到特定模組的替代。作為 ISP 工程師，理解 AI 方法的優勢和限制，將 AI 工具融入傳統 ISP 開發流程，是重要的技能趨勢。
</div>
`
    }
  ]
};
