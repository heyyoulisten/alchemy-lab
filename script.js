// 等待整个网页文档加载完毕后执行
document.addEventListener('DOMContentLoaded', () => {

    // ------------------- 1. 获取所有需要的DOM元素 (一次性获取) -------------------
    const challengeTab = document.getElementById('challenge-tab');
    const challengeModal = document.getElementById('challenge-modal');
    const alchemyCloseButton = challengeModal.querySelector('.close-button');
    const dialogueText = document.getElementById('dialogue-text');
    const elementIcons = document.querySelectorAll('.element-icon');
    
    const easterEggOverlay = document.getElementById('easter-egg-overlay');
    const closeEasterEggButton = document.getElementById('close-easter-egg');
    const easterEggImage = document.getElementById('easter-egg-image');
    const easterEggTitle = document.getElementById('easter-egg-title');
    const easterEggStory = document.getElementById('easter-egg-story');
    
    const grimoireTab = document.getElementById('grimoire-tab');
    const grimoireModal = document.getElementById('grimoire-modal');
    const grimoireCloseButton = grimoireModal.querySelector('.close-button');
    const scrollItems = document.querySelectorAll('.scroll-item');
    const contentOverlay = document.getElementById('grimoire-content-overlay');
    const contentTitle = document.getElementById('grimoire-content-title');
    const contentBody = document.getElementById('grimoire-content-body');
    const closeContentOverlayButton = document.getElementById('close-content-overlay');


    // ------------------- 2. 定义我们的状态和两大知识库 -------------------
    let selectedElements = [];
    let isFirstVisit = true;

    const reactionKnowledgeBase = {
        // --- 类别一：碱金属的狂热 (Alkali Metals) ---
        'Cl-K': { reacts: true, description: '一场壮丽的紫色献祭！当高贵的金属钾(K)触碰到淡绿色的氯(Cl)之息，它便燃起自身，发出淡紫色的灵魂之火，将自己完全奉献。从这纯粹的火焰牺牲之中，一个稳定、平和的白色晶体——氯化钾(KCl)——就此诞生。这便是从激情到永恒的炼金之道！' },
        'Cl-Na': { reacts: true, description: '命运的相遇！当金属钠(Na)燃烧时，它发出耀眼的黄色光芒，迫切地想抛弃它唯一的“外层光环”。而贪婪的氯气(Cl)则疯狂地渴望夺取一个。这场剧烈的能量交换，诞生了稳定而平和的食盐(NaCl)晶体！' },
        'F-K': { reacts: true, description: '当最大方的施予者——钾(K)，遇到了最贪婪的索取者——氟(F)，一场宇宙中最迅速的契约就此签订！钾毫不犹豫地献出它的“光环”，氟则以雷霆之势将其夺走。这电光石火的结合，形成了异常牢固的氟化钾(KF)。' },
        'Br-Li': { reacts: true, description: '锂(Li)，最轻盈的金属精灵，勇敢地冲向了深红色的溴(Br)蒸汽。它们的热情足以点燃彼此，最终化作了溴化锂(LiBr)的白色粉末。这是一场奋不顾身的爱恋！' },
        'H-Na': { reacts: true, description: '金属钠(Na)与氢气(H)在加热的催化下，进行了一场力量的融合。钠放弃了金属的身份，氢也收敛了气体的形态，它们共同化身为白色的神秘粉末——氢化钠(NaH)。' },
        'K-O': { reacts: true, description: '钾(K)对氧(O)的爱是如此深沉，它甚至能形成比氧化物更复杂的超氧化物(KO₂)。它燃烧时的淡紫色火焰，是它独有的、高贵的示爱方式。' },
        
        // --- 类别二：碱土金属的荣耀 (Alkaline Earth Metals) ---
        'Ca-O': { reacts: true, description: '钙(Ca)，骨骼与山脉的建造者，当它燃烧时，会发出明亮的橙红色光芒！这是它与氧(O)结合，化为纯白生石灰(CaO)的庄严仪式。' },
        'Mg-O': { reacts: true, description: '镁(Mg)被点燃时，会爆发出太阳般耀眼的白光！它是在用自己全部的生命力与氧(O)进行神圣的结合，最终化为纯白色的灰烬——氧化镁(MgO)。炼金术士，切勿直视这神圣之光！' },

        // --- 类别三：过渡金属的传说 (Transition Metals) ---
        'Fe-O': { reacts: true, description: '这是一场缓慢而坚定的转化。强大的铁(Fe)在潮湿的空气中与氧(O)进行着漫长的对话，渐渐地，它被氧的温柔所“腐蚀”，披上了一层红色的外衣，我们称之为“铁锈”(三氧化二铁)。' },
        'Ag-S': { reacts: true, description: '即使是月光般皎洁的白银(Ag)，也无法逃脱硫(S)的黑暗低语。空气中微量的硫会让它的光辉蒙尘，生成一层暗淡的硫化银(Ag₂S)。这是光明被岁月侵蚀的痕迹。' },
        'Cu-O': { reacts: true, description: '铜(Cu)在火焰中加热，会由红色变为深邃的黑色，仿佛披上了一件黑色的外袍。这是它与氧(O)结合，生成了氧化铜(CuO)。但若将这黑袍再次灼烧，它又能变回红色，真是神奇的循环！' },
        'Hg-S': { reacts: true, description: '液态的金属水银(Hg)与硫(S)粉相遇，会迅速结合，生成红色的硫化汞(HgS)，在古代被称为“朱砂”或“丹砂”。一种美丽而剧毒的造物。' },

        // --- 类别四：碳与硅的造物 (Creators from Group 14) ---
        'C-O': { reacts: true, description: '碳(C)与氧(O)的故事有两个版本。若氧气充足，碳会完全奉献自己，生成稳定祥和的二氧化碳(CO₂)。若氧气不足，这场结合会不完整，产生出剧毒的“无声幽灵”——一氧化碳(CO)。' },
        'H-C': { reacts: true, description: '生命的基本契约！碳(C)，这位宇宙的终极建筑师，与最丰富的元素氢(H)携手，构建了从最简单的甲烷(CH₄)到复杂DNA的宏伟王国。这不是一次反应，而是一切有机生命的开端。' },
        'O-Si': { reacts: true, description: '当沙子的灵魂——硅(Si)与氧(O)在极高的温度下熔融并结合，就形成了透明、坚固又美丽的石英(SiO₂)，也就是玻璃的主要成分。这是从平凡的沙砾到璀璨水晶的伟大升华！' },
        
        // --- 类别五：非金属的协奏与对决 ---
        'H-O': { reacts: true, description: '氢(H)与氧(O)，宇宙中最基础的两种创世之力！在“神之火花”(点燃)的指引下，它们将相互拥抱，最终化身为生命之源——纯净的水(H₂O)！这不是简单的反应，这是创世纪！' },
        'O-S': { reacts: true, description: '硫(S)在氧气中燃烧，会发出蓝紫色的迷人火焰，同时散发出令人窒息的气味。这是它在宣告自己转化为二氧化硫(SO₂)的仪式，一个美丽但危险的过程。' },
        'Cl-H': { reacts: true, description: '氢气(H)与氯气(Cl)在光照下会发生爆炸性的结合！它们共同形成了一种能溶解金属的强大酸性液体——盐酸(HCl)的“灵魂”。' },
        
        // 【【【 确认：“诺奖彩蛋”已添加/保留 】】】
        'H-N': { 
            reacts: true, 
            description: '在高温、高压和“贤者之石”的共同作用下，平日里慵懒的氮(N)终于与活泼的氢(H)达成了契约...',
            easterEgg: {
                type: 'nobel',
                title: '诺奖复现：哈伯-博施法',
                image: 'assets/haber_bosch.jpg',
                story: '在20世纪初，全球面临粮食危机，因为天然的氮肥极其稀少。德国化学家弗里茨·哈伯发明了直接从空气中捕获氮气并与氢气反应合成氨的方法，极大地提高了粮食产量，养活了数以亿计的人口。随后，卡尔·博施将此方法成功工业化。这项“点石成金”般的技术，让他们共同获得了诺贝尔化学奖，但它也在战争中被用于制造炸药，深刻地改变了人类历史的进程。'
            }
        },

        // 【【【 确认：“生活化学彩蛋”已添加/保留 】】】
        'BakingSoda-Vinegar': {
            reacts: true,
            description: '嘶... 大量的气泡正在喷涌而出！一股熟悉的酸味弥漫开来...',
            easterEgg: {
                type: 'life',
                title: '厨房里的魔法！',
                image: 'assets/baking_soda_volcano.jpg',
                story: '这个魔法你在厨房里也能实现哦！小苏打（碳酸氢钠）是碱性的，而你家厨房的白醋（主要成分是醋酸）是酸性的。当它们相遇，就会发生一场小小的“酸碱大战”，释放出大量的二氧化碳气体，也就是你看到的泡泡。这个原理可以用来制作有趣的火山模型，或者利用气体的力量来疏通堵塞的下水道呢！'
            }
        },
        
        // --- 类别六：无法撼动的贵族 (Noble Gases) & 同类的法则 ---
        'Ar-K': { reacts: false, description: '慷慨的钾(K)向氩(Ar)展示了它闪亮的“外层光环”，意图赠与。但高贵的氩，一位内心圆满的隐士，对这份礼物不屑一顾。' },
        'He-O': { reacts: false, description: '生命之力的源泉——氧(O)，向宇宙中最轻的精灵氦(He)发出了共舞的邀请。但氦，早已习惯了独自一人的自由，它轻盈地飘走了，没有留下一丝回应。' },
        'F-Ne': { reacts: false, description: '即使是宇宙中最贪婪的掠夺者氟(F)，也无法从氖(Ne)的身上抢走任何东西。氖的“光环”被它自身强大的意志牢牢守护着，固若金汤。' },
        'Ag-Au': { reacts: false, description: '黄金(Au)和白银(Ag)，都是高贵的金属。它们可以被熔融在一起，形成华丽的合金，但这只是物理上的混合。在灵魂深处，它们都太过骄傲和稳定，无法发生真正的化学反应。' },
        'Cl-F': { reacts: false, description: '一位是黄绿色的刺客(Cl)，一位是淡黄色的狂战士(F)。它们都渴望着从外界夺取力量，因此它们是天生的竞争者，而非合作者。' },
        'K-Na': { reacts: false, description: '两位慷慨的国王，钠(Na)和钾(K)，都想把自己的财宝（外层电子）送给对方，但谁也不愿意接受。这场“礼让”无法完成。' }
    };

    const grimoireContent = {
        '1': {
            title: '卷轴一：世界基石 —— 元素与原子',
            concepts: [
                { name: '原子 (Atom)', term: '元素精灵', magician: '世间万物，无论是坚硬的岩石还是流动的河水，都是由无数微小、活泼的‘元素精灵’构成的。每一种精灵都代表着一种纯粹的元素，比如火爆的金精灵、轻盈的氢精灵。它们是构成魔法世界的最小砖块。', scientist: '原子是化学变化中的最小微粒。它由位于中心的原子核（包含带正电的质子和不带电的中子）和核外带负电的电子组成。元素的种类由原子核中的质子数决定。', example: '一块纯金，就是由无数个一模一样的“金精灵”（金原子）紧密排列而成的。你无法再用化学方法分割出一个更小的金单位了。' },
                { name: '元素 (Element)', term: '原始质料', magician: '炼金术的根本，就是识别和运用这些‘原始质料’。目前已知的质料有一百多种，比如赋予生命的氧(Oxygen)、构成骨骼的钙(Calcium)、闪耀光芒的金(Gold)。它们是无法被炼金术再分解成更简单质料的纯粹存在。', scientist: '元素是具有相同核电荷数（即质子数）的一类原子的总称。例如，所有质子数为8的原子都属于氧元素。元素是构成物质的基本单位。', example: '水（H₂O）不是一种原始质料，因为它可以被分解成氢(Hydrogen)和氧(Oxygen)两种更基本的质料。而氢和氧本身，则无法再被分解。' },
                { name: '元素周期表 (Periodic Table)', term: '万物序列之书 / 元素魔典', magician: '这是一本传奇的魔法书，记录了所有已知的元素精灵。它按照精灵们的‘性格’（性质）和‘体重’（原子量）进行排布。同一列的精灵性格相似，而同一行的精灵则拥有相同的‘能量层级’。掌握了它，你就掌握了所有炼金术的基础配方。', scientist: '元素周期表是根据原子序数从小至大排序的化学元素列表。它揭示了元素性质的周期性规律——位于同一族的元素具有相似的化学性质。它是化学家最重要的工具之一。', example: '锂(Li)、钠(Na)、钾(K)在魔典的同一列，所以它们都是非常活泼、遇水会发生剧烈反应的“碱金属族”精灵。' }
            ]
        },
        '2': {
            title: '卷轴二：神奇缔结 —— 分子与化学键',
            concepts: [
                { name: '分子 (Molecule)', term: '元素合剂 / 炼成物', magician: '当不同的元素精灵通过特定的‘魔法契约’结合在一起时，就诞生了全新的‘元素合剂’。例如，两个活泼的氢精灵和一个稳重的氧精灵结合，就创造出了生命之源——水合剂。', scientist: '分子是由两个或多个原子通过化学键结合而成的电中性粒子。它能独立存在，并保持原物质的化学性质。', example: '我们呼吸的氧气，就是一个“氧气合剂”（O₂），由两个氧原子手拉手构成。我们喝的水，是“水合剂”（H₂O），由两个氢原子和一个氧原子构成。' },
                { name: '化学键 (Chemical Bond)', term: '魔法契约', magician: '元素精灵之间通过分享或转让自身的‘魔力’（电子）来建立连接，这种连接就是‘魔法契约’。有的契约是‘共享契约’（共价键），大家共同拥有魔力；有的是‘赠予契约’（离子键），一方将魔力完全赠予另一方，从而形成牢固的吸引力。', scientist: '化学键是分子或晶体中原子之间、离子之间或分子之间的相互作用力。主要类型有共价键（原子间共享电子对）和离子键（一个原子失去电子变为正离子，另一个原子得到电子变为负离子，通过静电吸引结合）。', example: '食盐（NaCl）的形成，就是钠(Na)精灵将一个魔力电子“赠予”氯(Cl)精灵，形成了一个“赠予契约”（离子键）。' },
                { name: '化学式 (Chemical Formula)', term: '炼金配方', magician: '每一个炼成物都有其精确的‘炼金配方’，记录了制作它需要哪些元素精灵，以及各需要多少个。例如，水的配方是 H₂O，意为‘需要2份氢精灵和1份氧精灵’。', scientist: '化学式是用来表示物质组成的式子。它标明了分子中包含的元素种类和各元素的原子个数。', example: '葡萄糖的配方 C₆H₁₂O₆，告诉我们这个甜蜜的物质需要6个碳原子、12个氢原子和6个氧原子才能合成。' }
            ]
        },
        '3': {
            title: '卷轴三：物质嬗变 —— 化学反应',
            concepts: [
                { name: '化学反应 (Chemical Reaction)', term: '嬗变术 / 炼金仪式', magician: '这是炼金术的最高艺术！通过加热、混合或施加特定‘咒语’（催化剂），我们可以打破元素精灵间旧的‘魔法契约’，并引导它们建立新的契约，从而将一种物质转变为全新的物质。这就是‘嬗变术’的真谛。', scientist: '化学反应是一个或多个物质（反应物）经由化学变化，转化为性质不同的其他物质（生成物）的过程。这个过程中，原子的种类和数量不变，只是重新组合。', example: '铁生锈，就是一个缓慢的“嬗变术”。铁精灵（Fe）在空气中的氧精灵（O₂）和水精灵（H₂O）的共同作用下，变成了新的物质——铁锈（主要成分Fe₂O₃）。' },
                { name: '质量守恒定律 (Law of Conservation of Mass)', term: '炼金第一法则：无物生灭', magician: '记住，伟大的炼金师！在任何嬗变仪式中，元素精灵的总量是永恒不变的。它们不会凭空消失，也不会凭空产生。你投入多少，最终就能回收多少，只是形态改变了而已。', scientist: '在任何一个孤立的系统中，不论发生何种变化或过程，其总质量保持不变。在化学反应中，反应前所有反应物的总质量等于反应后所有生成物的总质量。', example: '点燃一根蜡烛，蜡烛看似“消失”了。但如果你能收集到燃烧产生的所有气体（二氧化碳和水蒸气），你会发现这些生成物的总质量，精确地等于燃烧掉的蜡烛和消耗掉的氧气的总质量。' },
                { name: '催化剂 (Catalyst)', term: '魔法符文 / 仪式媒介', magician: '有些嬗变仪式非常缓慢，需要一种特殊的‘魔法符文’来加速。这种符文能极大地提高仪式效率，但它本身在仪式结束后完好无损，可以重复使用。它就像一位引导精灵们快速重组的仪式主持人。', scientist: '催化剂是在化学反应中能改变反应速率，而本身质量和化学性质在反应前后都没有发生变化的物质。', example: '汽车的尾气净化器里含有铂(Pt)、钯(Pd)等贵金属，它们就是“魔法符文”，能将有毒的汽车尾气（如一氧化碳）快速转化为无毒的二氧化碳。' }
            ]
        },
        '4': {
            title: '卷轴四：能量与形态 —— 反应能量与物态',
            concepts: [
                { name: '放热/吸热反应 (Exothermic/Endothermic Reaction)', term: '释能/聚能仪式', magician: '每次嬗变仪式都会伴随着宇宙能量‘以太’(Aether)的流动。有的仪式会释放出光和热，称为‘释能仪式’，让周围变暖。有的则需要从环境中吸收能量才能进行，称为‘聚能仪式’，会让周围变冷。', scientist: '放热反应是反应过程中释放能量（通常是热能）的化学反应。吸热反应则是吸收能量的化学反应。', example: '释能： 燃烧木头，是典型的释能仪式，释放出大量的光和热。\n聚能： 很多医用冰袋里含有硝酸铵，捏破内袋让它和水混合，会立刻吸收周围热量变得冰冷，这就是一个聚能仪式。' },
                { name: '物态变化 (Changes of State)', term: '形态转换', magician: '元素合剂可以在不同形态间转换。当它们能量低、精灵们紧紧抱团时，是‘固态’（如冰）；获得一些能量开始滑动时，是‘液态’（如水）；获得大量能量自由飞翔时，是‘气态’（如水蒸气）。这只是形态的改变，并非嬗变。', scientist: '物质的状态（固态、液态、气态）取决于其内能和粒子间的距离/作用力。通过加热或冷却，物质可以在这几种状态之间转化，这属于物理变化，不改变物质的化学成分。', example: '水的三种形态：冰（固态）、水（液态）、水蒸气（气态），它们的“炼金配方”都是 H₂O，本质上是同一种物质.' }
            ]
        }
    };


    // ------------------- 3. 核心功能函数 (结构清晰，只定义一次) -------------------

    function triggerEasterEgg(eggData) {
        if (!easterEggImage || !easterEggTitle || !easterEggStory || !easterEggOverlay) return;
        easterEggImage.src = eggData.image;
        easterEggTitle.textContent = eggData.title;
        easterEggStory.textContent = eggData.story;
        easterEggOverlay.classList.remove('hidden');
    }

    function checkReaction(el1, el2) {
        const key = [el1, el2].sort().join('-');
        return reactionKnowledgeBase[key] || {
            reacts: false,
            description: `炼金釜中的'${el1}'和'${el2}'似乎对彼此不感兴趣，它们在静静地漂浮着...`
        };
    }

    function resetSelection() {
        dialogueText.textContent = '新的挑战开始了！请选择你感兴趣的第一个元素。';
        selectedElements = [];
        elementIcons.forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    function handleElementClick(event) {
        const clickedIcon = event.target.closest('.element-icon');
        if (!clickedIcon) return;
        
        const elementName = clickedIcon.dataset.element;

        if (selectedElements.length >= 2) return;
        if (selectedElements.includes(elementName)) {
            dialogueText.textContent = `你已经选择了'${elementName}'，请选择一个不同的元素。`;
            return;
        }

        clickedIcon.classList.add('selected');
        selectedElements.push(elementName);

        if (selectedElements.length === 1) {
            dialogueText.textContent = `你选择了'${selectedElements[0]}'。很好，现在请选择第二个元素...`;
        } else if (selectedElements.length === 2) {
            const result = checkReaction(selectedElements[0], selectedElements[1]);
            dialogueText.textContent = result.description;

            if (result.easterEgg) {
                setTimeout(() => {
                    triggerEasterEgg(result.easterEgg);
                }, 2000);
            }
            setTimeout(resetSelection, 5500);
        }
    }

    function renderGrimoireContent(scrollId) {
        const data = grimoireContent[scrollId];
        if (!data) return;
        contentTitle.textContent = data.title;
        contentBody.innerHTML = '';
        data.concepts.forEach(concept => {
            const block = document.createElement('div');
            block.className = 'concept-block';
            block.innerHTML = `
                <h4 class="concept-title">${concept.name}</h4>
                <p class="concept-interpretation"><strong class="concept-term">${concept.term}:</strong> ${concept.magician}</p>
                <p class="concept-interpretation"><strong class="concept-term">科学解读:</strong> ${concept.scientist}</p>
                <div class="concept-example"><strong class="concept-term">趣味实例:</strong> ${concept.example.replace(/\n/g, '<br>')}</div>
            `;
            contentBody.appendChild(block);
        });
    }

    function showContentView(scrollId) {
        renderGrimoireContent(scrollId);
        contentOverlay.classList.remove('hidden');
    }


    // ------------------- 4. 绑定事件监听器 (一次性绑定) -------------------

    challengeTab.addEventListener('click', () => {
        grimoireModal.classList.add('hidden'); // 确保另一个窗口是关闭的
        challengeModal.classList.remove('hidden');
        
        if (isFirstVisit) {
            // 如果是第一次访问，我们不做任何事，让HTML中默认的欢迎语显示出来
            // 然后，将isFirstVisit标志设为false，这样下次点击就不是第一次了
            isFirstVisit = false;
        } else {
            // 如果不是第一次访问，我们就调用resetSelection函数，显示“新的挑战开始了！”
            resetSelection();
        }
    });

    grimoireTab.addEventListener('click', () => {
        challengeModal.classList.add('hidden'); // 确保另一个窗口是关闭的
        grimoireModal.classList.remove('hidden');
        // (此处省略了典籍的内部逻辑)
    });

    grimoireTab.addEventListener('click', () => {
        challengeModal.classList.add('hidden');
        grimoireModal.classList.remove('hidden');
    });

    alchemyCloseButton.addEventListener('click', () => challengeModal.classList.add('hidden'));
    grimoireCloseButton.addEventListener('click', () => {
        grimoireModal.classList.add('hidden');
        contentOverlay.classList.add('hidden');
    });
    
    closeEasterEggButton.addEventListener('click', () => easterEggOverlay.classList.add('hidden'));

    scrollItems.forEach(item => {
        item.addEventListener('click', () => {
            const scrollId = item.dataset.scroll;
            showContentView(scrollId);
        });
    });

    closeContentOverlayButton.addEventListener('click', () => {
        contentOverlay.classList.add('hidden');
    });
    
    elementIcons.forEach(icon => {
        icon.addEventListener('click', handleElementClick);
    });
});