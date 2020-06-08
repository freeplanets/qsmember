export default {
  Error : [
    "OK!!",             //0
    "低於最小下注金額",   //1
    "高於最大下注金額",   //2
    "單碼滿倉",          //3
    "聯碼滿倉",           //4
    "停押",               //5
    "額度不足",           //6
    "尚未登入",           //7
    "已有注單,無法刪除",   //8
  ],  
  Label: {
    GameName: '彩局名稱',
    ClassName: '類別名稱',
    InputClassName: '請輸入類別名稱...',
    PayClassManage: '盤口設置',
    BasePayClassManage: '基本盤口設置',
    PayClassName: '盤口名稱',
    InputPayClassName: '請輸入分盤名稱',
    SavePayClassName: '儲存分盤名稱',
    EditPayClassName: '修改分盤名稱',
    DeletePayClass: '刪除分盤',
    BasePayRate:"基本盤",
    RefPayRate:"參考分盤",
    CratePayClass:"新增分盤",
    PayClassFunc: "基本盤賠率%,基本盤利潤差,固定利潤,浮動利潤",
    RateDiff:"賠率差距",
    RateDiffInfo:"正數,表示分盤賠率佔基本盤比率不可以小於90",
    ProfitDiff:"利潤差距",
    ProfitDiffInfo:"正值表示利潤比基本盤高，負值表示比基本盤低",
    FixProfit:"固定利潤",
    FixProfitInfo:"所有下注項目都是相同利潤",
    FloatProfit:"浮動利潤",
    FloatProfitInfo:"根據中獎機率設定不同利潤",
    WinChance:"中獎機率",
    Time: '時間',
    Date: '日期',
    TermManager:"彩期管理",
    AddTerm: "新增彩期",
    EditTerm: "修改彩期",
    OpenDate:"開獎日期",
    BetEndTime:"下注截止時間",
    SpNo:"特碼",
    Save:"存檔",
    Cancel:"取消",
    Delete:"刪除",
    Unselected:"未選取過項目",
    TermID:"期次",
    GameManager:"彩票管理",
    SPEndTime:"特碼截止時間",
    AddUser:"新增用戶",
    UserManager:"用戶管理",
    Member:'會員',
    Agent:'代理',
    WebOwner:'網站站主',
    Operator:'操盤手',
    InputNums:'輸入號碼',
    Status:'狀態',
    Settled:['','己結帳','','己重結'],
    OpenParams:'開盤參數',
    OddsManager:'控盤',
    BetLists:'注單查詢',
    NameOrNick:'名稱/代號',
    TotalN:'共 {N} 筆',
    BetReport:'下注報表',
    UseAvgMsg:'啟用為均賠率派彩。不啟用為最小賠率派彩。',
    Sec:'秒',
    Refresh:'更新',
    TicketStatus: [
      '成交',
      '會員取消',
      '系統註銷'
    ]
  },
  Tip:{
    UserFind: "請輸入名稱或代號"
  },
  Table: {
    ItemName: "項目名稱",
    SubName: "指定名稱",
    NoAdjust: "不調盤",
    Profit:"利潤",
    RateDefault:"賠率",
    RateTop:"賠率上限",
    Probability:"機率",
    TopPay:"最高派彩",
    OneHand: "公司單注",
    PlusRate: "加本金",
    LowestBet:"最小下注",
    SingleBet:"最大單注",
    OfficeSite: '官網',
    StopBeforeEnd:"提前封盤秒數",
    BothSideAdjust:"採用兩面押碼",
    AutoOpen:"自動開放下注",
    TwoMoreGame:"過闗賠率差距",
    TwoSide:"兩面",
    ColorWave:"色波",
    DelAfterBet:"會員可刪除秒數",
    DelBeforeEnd:"截止刪除注單秒數",
    PayClassID: '盤口',
    Account: '帳號',
    Password: '密碼',
    Nickname: '暱稱',
    Types: '類別',
    Levels: '層級',
    CreateDate: '新增日期',
    TotalNums:'號數',
    UseAvg:'平均值押碼',
    SingleNum:'單碼滿倉',
    UnionNum:'連碼滿倉',
    MinHand:'最小單注',
    MaxHand:'最大單注',
    UseAvgOdds:'使用均成本(或最小)',
    GType:"遊戲代號",
    GameItems:'遊戲項目',
    ChangeStart:"押碼啟動全額",
    BetForChange:"押碼全額",
    PerStep:"跳動點",
    Steps:"押碼點數",
    StepsGroup:"押碼級距",
    StopTimeS:"特碼下注截止時間",
    StopTime:"下注截止時間",
    Result:'開獎結果'
  },
  Title: {
    Dashboard: '大廳',
    ChangePassword: '變更密碼',
    AccHistory: '帳戶歷史',
    PersonalInfo: '個人中心',
    CPassword: '新登入密碼確認',
    NPassword: '新登入密碼',
    OPassword: '原登入密碼',
    PassERR: '新登入密碼和碓認碼不同',
    PassChgMsg: '密碼已修改,請重新登入!',
    LoginERR: '帳碼或密碼錯誤!!',
    Item:'項目',
    OValue:'舊值',
    NValue:'新值',
    EditMan:'修改人員'
  },
  Button: {
    Num: '號碼',
    FastSlt: '快選',
    DSP: '雙兩盤',
    More: '更多',
    ClearSlt: '清空選取',
    TotalSlted: '共選了',
    Ball: '球',
    Send: '確定送出', 
    TotalStop: '總停押',
    PageStop: '本頁停押',
    TotalOpen: '總開放',
    PageOpen: '本頁開放',
    Confirm: '碓認',
    Search:'查詢',
    Clear:'清除',
    EditRecord:'修改記錄',
    Edit:'修改'
  },
  Dialog: {
    MTitle: '主選單',
    OdrDetail: '下注明細',
    ShowAll: '全部顯示',
    Settled: '己結算',
    Unsettle: '未結算',
    OpenResult: '開獎結果',
    LastTenTerms: '最近10期',
    TodayAll: '今日全部',
    NumTotal: '和值',
    NumAllTotal: '總數',
    Attention: '注意',
    DelBCMsg: '是否要刪除分類'
  },
  InputSwitch: [
    { title: '一般', isActive: 'false' },
    { title: '鍵盤', isActive: 'false' },
    { title: '包牌', isActive: 'false' }
  ],
  NotOpen: '非開放',
  Exit: '離開',
  MsgNoNum: '未選取任何號碼',
  TPos: '十位',
  OPos: '個位',
  Next: '下一步',
  NoGameData: '下注失敗，請重新下注',
  Inputs: '請輸入每注金額...',
  OrderPass: '下單成功',
  Wager: '下注',
  func: {
    Odd: '單',
    Even: '雙',
    Big: '大',
    Small: '小',
    Clear: '清',
    NumOdr: '號碼投注',
    DSOdr: '雙面盤',
    TotOdd: '合單',
    TotEven: '合雙',
    BigOdd: '大單',
    BigEven: '大雙',
    SmallOdd: '小單',
    SmallEven: '小雙'
  },
  Report: {
    Today: '今日',
    Yesterday:'昨日',
    Beforeday:"前一日",
    Orders: '投注額',
    Result: '結果',
    Commission: '退水',
    WinLose: '輸贏',
    OrderNo: '單號',
    OrderTime: '下單時間',
    ThisWeek: '本週',
    LastWeek: '上週',
    ThisMonth: '本月',
    LastMonth: '上月',
    SinceLastMonth: '從上月起',
    Item: '項目',
    Comm: '退水',
    SingleBet: '單注',
    SingleBT: '單場',
    OdrType: '下注項目',
    OdrAmt: '下注金額',
    Total: '合計',
    GeneralLedger:'總帳',
    Ledger:'分類帳',
    DayReport:'日報表'
  },
  Common: {
    AccHistory: '帳戶歷史',
    Report: '本日明細',
    Bulletin: '公告',
    Setup: '設定',
    Logout: '登出',
    Confirm: '確定',
    OrderPass: '下單成功',
    NoGameData: '下注失敗，請重新下注',
    Last10Term: '最近10期',
    Term: '期',
    Points: '點數',
    PersonalInfo: '個人中心',
    InputMsg: '請輸入號碼,並用逗號（，）隔開.',
    PersonalParams: '會員參數',
    Rule: '規則',
    RuleInfo: '規則說明',
    LongDragon: '長龍'
  },
  LongDragon: { CoOut: '連續開獎', NoOut: '連續未開' },
  FastSlt: {
    FastInput: '快填',
    Box: '包牌',
    Set3: '組3包車',
    Set6: '組6包車',
    Pair: '對子',
    Hundreds: '百位',
    Tens: '十位',
    Units: '個位'
  },
  Game: {
    Cars: {
      Menu: {
        Group: [
          { title: '兩面盤', SubItem: [] },
          {
            title: '數字盤',
            SubItem: [
              { id: 1, name: '冠軍' },
              { id: 2, name: '亞軍' },
              { id: 3, name: '第 3 名' },
              { id: 4, name: '第 4 名' },
              { id: 5, name: '第 5 名' },
              { id: 6, name: '第 6 名' },
              { id: 7, name: '第 7 名' },
              { id: 8, name: '第 8 名' },
              { id: 9, name: '第 9 名' },
              { id: 10, name: '第 10 名' }
            ],
            SubMenu: [ '號碼投注', '雙面盤' ]
          },
          { title: '冠亞總和', SubItem: [], SubMenu: [ '號碼投注', '雙面盤' ] },
          { title: '前 2/3/4 組合', SubMenu: [ '前2組合', '前3組合', '前4組合' ] }
        ],
        BothSide: {
          BigSmall: [ '大', '小' ],
          OddEven: [ '單', '雙' ],
          Animal: [ '龍', '虎' ]
        }
      },
      Item: {
        '1': {
          title: '1-10名 車號',
          sctitle: [
            '',   '冠軍',  '亞軍',
            '3名', '4名',  '5名',
            '6名', '7名',  '8名',
            '9名', '10名'
          ]
        },
        '2': {
          title: '1-10名 大小',
          sctitle: [
            '',    '冠軍',   '亞軍',
            '第 3', '第 4',  '第 5',
            '第 6', '第 7',  '第 8',
            '第 9', '第 10'
          ],
          subTitle: [ '大', '小' ]
        },
        '3': {
          title: '1-10名 單雙',
          sctitle: [
            '',    '冠軍',   '亞軍',
            '第 3', '第 4',  '第 5',
            '第 6', '第 7',  '第 8',
            '第 9', '第 10'
          ],
          subTitle: [ '單', '雙' ]
        },
        '4': {
          title: '1-5 龍虎',
          sctitle: [ '', '冠軍', '亞軍', '第 3', '第 4', '第 5' ],
          subTitle: [ '龍', '虎' ]
        },
        '5': { title: '冠亞和大小', sctitle: [ '冠亞和' ], subTitle: [ '大', '小' ] },
        '6': { title: '冠亞和單雙', sctitle: [ '冠亞和' ], subTitle: [ '單', '雙' ] },
        '7': { title: '冠亞和值' },
        '8': { title: '前2組合' },
        '9': { title: '前3組合' },
        '10': { title: '前4組合' }
      },
      Ball: [
        '',       '冠軍',
        '亞軍',     '第 3 名',
        '第 4 名',  '第 5 名',
        '第 6 名',  '第 7 名',
        '第 8 名',  '第 9 名',
        '第 10 名'
      ]
    },
    MarkSix: {
      Menu: {
        Group: [
          { title: '兩面盤', SubItem: [] },
          { title: '特碼', BT: 1, SubItem: [], SubMenu: [] },
          { title: '正碼', BT: 4, SubItem: [], SubMenu: [] },
          { title: '正碼特', BT: 21, SubMenu: [] },
          { title: '連碼', SubMenu: [] },
          { title: '不中', SubMenu: [] },
          { title: '多選', SubMenu: [] },
          { title: '特平', SubMenu: [] },
          { title: '生肖', SubMenu: [] },
          { title: '尾數', SubMenu: [] },
          { title: '色波', SubMenu: [] },
          { title: '半波', SubMenu: [] },
          { title: '合肖', SubMenu: [] },
          { title: '生肖連', SubMenu: [] },
          { title: '尾數連', SubMenu: [] },
          { title: '七碼', SubMenu: [] },
          { title: '正碼過關', SubMenu: [] },
          { title: '其他', SubMenu: [] }
        ],
        BothSide: {
          BigSmall: [ '大', '小' ],
          OddEven: [ '單', '雙' ],
          Animal: [ '龍', '虎' ]
        }
      },
      Item: {
        '1': { title: '特碼A' },
        '2': { title: '特碼單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '3': { title: '特碼大小', shortT: '', subtitle: [ '大', '小' ] },
        '4': { title: '正碼' },
        '5': { title: '總和', shortT: '合', subtitle: [ '單', '雙' ] },
        '6': { title: '總和', shortT: '合', subtitle: [ '大', '小' ] },
        '7': { title: '三全中' },
        '8': { title: '三中二 I' },
        '9': { title: '二全中' },
        '10': { title: '二中特 I' },
        '11': { title: '特串' },
        '12': {
          title: '正碼1-6單雙',
          sctitle: [
            '',   '正1', '正2',
            '正3', '正4', '正5',
            '正6'
          ],
          subtitle: [ '單', '雙' ]
        },
        '13': {
          title: '正碼1-6大小',
          sctitle: [
            '',   '正1', '正2',
            '正3', '正4', '正5',
            '正6'
          ],
          subtitle: [ '大', '小' ]
        },
        '14': {
          title: '正碼1-6色波',
          sctitle: [
            '',   '正1', '正2',
            '正3', '正4', '正5',
            '正6'
          ],
          subtitle: [ '紅波', '藍波', '綠波' ]
        },
        '15': {
          title: '正碼過關',
          sctitle: [
            '',   '正1', '正2',
            '正3', '正4', '正5',
            '正6'
          ]
        },
        '16': { title: '特碼合數', shortT: '合', subtitle: [ '單', '雙' ] },
        '17': { title: '特碼色波', shortT: '', subtitle: [ '紅波', '藍波', '綠波' ] },
        '18': {
          title: '特碼生肖',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '19': {
          title: '生肖',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '20': {
          title: '尾數',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '21': { title: '正1特' },
        '22': { title: '正2特' },
        '23': { title: '正3特' },
        '24': { title: '正4特' },
        '25': { title: '正5特' },
        '26': { title: '正6特' },
        '27': {
          title: '正1-6合數',
          sctitle: [
            '',   '正1', '正2',
            '正3', '正4', '正5',
            '正6'
          ],
          shortT: '合',
          subtitle: [ '單', '雙' ]
        },
        '28': { title: '特碼B' },
        '29': {
          title: '半波',
          shortT: '',
          subtitle: [
            '紅單', '紅雙', '紅大',
            '紅小', '藍單', '藍雙',
            '藍大', '藍小', '綠單',
            '綠雙', '綠大', '綠小'
          ]
        },
        '30': {
          title: '六肖',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '免', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '31': { title: '五不中' },
        '32': {
          title: '二肖連-中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '33': {
          title: '三肖連-中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '34': {
          title: '四肖連-中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '35': {
          title: '二肖連-不中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '36': {
          title: '三肖連-不中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '37': {
          title: '四肖連-不中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '38': {
          title: '二尾連-中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '39': {
          title: '三尾連-中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '40': {
          title: '四尾連-中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '41': {
          title: '二尾連-不中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '42': {
          title: '三尾連-不中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '43': {
          title: '四尾連-不中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '44': {
          title: '五肖連-中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '45': {
          title: '五肖連-不中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '兔', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '46': {
          title: '五尾連-中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '47': {
          title: '五尾連-不中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '48': { title: '六不中' },
        '49': { title: '七不中' },
        '50': { title: '八不中' },
        '51': { title: '九不中' },
        '52': { title: '十不中' },
        '53': { title: '七碼', shortT: '', subtitle: [ '單', '雙', '大', '小' ] },
        '54': {
          title: '五行',
          shortT: '',
          subtitle: [ '金', '木', '水', '火', '土' ]
        },
        '55': {
          title: '一肖量',
          shortT: '',
          subtitle: [ '肖2', '肖3', '肖4', '肖5', '肖6', '肖7' ]
        },
        '56': {
          title: '尾數量',
          shortT: '',
          subtitle: [ '尾2', '尾3', '尾4', '尾5', '尾6', '尾7' ]
        },
        '57': { title: '五中一' },
        '58': { title: '六中一' },
        '59': { title: '七中一' },
        '60': { title: '八中一' },
        '61': { title: '九中一' },
        '62': { title: '十中一' },
        '63': { title: '一粒任中' },
        '64': { title: '二粒任中' },
        '65': { title: '三粒任中' },
        '66': { title: '四粒任中' },
        '67': { title: '五粒任中' },
        '68': { title: '龍虎', shortT: '', subtitle: [ '龍', '虎' ] },
        '69': {
          title: '一肖不中',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '免', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '70': {
          title: '尾數不中',
          shortT: '',
          subtitle: [
            '0尾', '1尾', '2尾',
            '3尾', '4尾', '5尾',
            '6尾', '7尾', '8尾',
            '9尾'
          ]
        },
        '71': { title: '四中一' },
        '72': { title: '三中二 II' },
        '73': { title: '二中特 II' },
        '74': { title: '特碼尾大小', shortT: '尾', subtitle: [ '大', '小' ] },
        '75': {
          title: '二肖',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '免', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '76': {
          title: '三肖',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '免', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '77': {
          title: '四肖',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '免', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        },
        '78': {
          title: '五肖',
          shortT: '',
          subtitle: [
            '',  '鼠', '牛', '虎',
            '免', '龍', '蛇', '馬',
            '羊', '猴', '雞', '狗',
            '豬'
          ]
        }
      },
      TitleSP: {
        SNO: [
          '',  '一', '二',
          '三', '四', '五',
          '六'
        ]
      }
    },
    Happy: {
      Menu: {
        Group: [
          { title: '兩面盤', SubItem: [] },
          { title: '數字盤', SubItem: [], SubMenu: [] },
          { title: '正碼', SubItem: [], SubMenu: [] },
          { title: '連碼', SubMenu: [] }
        ]
      },
      Item: {
        '1': {
          title: '單碼',
          sctitle: [
            '',   '1球', '2球',
            '3球', '4球', '5球',
            '6球', '7球', '8球'
          ]
        },
        '2': {
          title: '單雙',
          sctitle: [
            '',   '1球', '2球',
            '3球', '4球', '5球',
            '6球', '7球', '8球'
          ],
          subtitle: [ '單', '雙' ]
        },
        '3': {
          title: '大小',
          sctitle: [
            '',   '1球', '2球',
            '3球', '4球', '5球',
            '6球', '7球', '8球'
          ],
          subtitle: [ '大', '小' ]
        },
        '4': {
          title: '合數單雙',
          sctitle: [
            '',   '1球', '2球',
            '3球', '4球', '5球',
            '6球', '7球', '8球'
          ],
          shortT: '合數',
          subtitle: [ '單', '雙' ]
        },
        '5': {
          title: '尾數大小',
          sctitle: [
            '',   '1球', '2球',
            '3球', '4球', '5球',
            '6球', '7球', '8球'
          ],
          shortT: '尾數',
          subtitle: [ '大', '小' ]
        },
        '7': { title: '方位' },
        '9': { title: '中發白' },
        '10': { title: '總和大小', shortT: '總和', subtitle: [ '大', '小' ] },
        '11': { title: '總和單雙', shortT: '總和', subtitle: [ '單', '雙' ] },
        '12': { title: '總和尾數大小', shortT: '和尾', subtitle: [ '大', '小' ] },
        '13': {
          title: '龍虎',
          sctitle: [
            '',   '1球', '2球',
            '3球', '4球', '5球',
            '6球', '7球', '8球'
          ],
          subtitle: [ '龍', '虎' ]
        },
        '14': { title: '正碼' },
        '15': { title: '任選二' },
        '16': { title: '選二連組' },
        '17': { title: '任選三' },
        '18': { title: '選三前組' },
        '19': { title: '任選四' },
        '20': { title: '任選五' }
      },
      Ball: [
        '',    '第一球', '第二球',
        '第三球', '第四球', '第五球',
        '第六球', '第七球', '第八球'
      ]
    },
    Always: {
      Menu: {
        Group: [
          { title: '兩面盤', SubItem: [] },
          { title: '數字盤', SubItem: [], SubMenu: [] },
          { title: '雜項', SubMenu: [] }
        ]
      },
      Item: {
        '1': { title: '單碼', sctitle: [ '', '1球', '2球', '3球', '4球', '5球' ] },
        '2': {
          title: '1-5 大小',
          sctitle: [ '', '1球', '2球', '3球', '4球', '5球' ],
          subtitle: [ '大', '小' ]
        },
        '3': {
          title: '1-5 單雙',
          sctitle: [ '', '1球', '2球', '3球', '4球', '5球' ],
          subtitle: [ '單', '雙' ]
        },
        '5': { title: '總和', subtitle: [ '大', '小' ] },
        '6': { title: '總和', subtitle: [ '單', '雙' ] },
        '7': { title: '龍虎', subtitle: [ '龍', '虎' ] },
        '8': { title: '龍虎', subtitle: [ '和', '' ] },
        '12': { title: '前三', subtitle: [ '', '豹子', '順子', '對子', '半順', '雜六' ] },
        '13': { title: '中三', subtitle: [ '', '豹子', '順子', '對子', '半順', '雜六' ] },
        '14': { title: '後三', subtitle: [ '', '豹子', '順子', '對子', '半順', '雜六' ] }
      },
      Ball: [ '', '第一球', '第二球', '第三球', '第四球', '第五球' ]
    },
    '3D': {
      Menu: {
        Group: [
          { title: '兩面盤', SubItem: [] },
          { title: '一字', SubItem: [] },
          { title: '二字組合', SubItem: [] },
          { title: '二定位', SubItem: [] },
          { title: '二字和數', SubMenu: [] },
          { title: '二字和尾', SubMenu: [] },
          { title: '三定位', BT: 42, dgt: 3, SubMenu: [] },
          { title: '三字', BT: 43, dgt: 3, SameNum: 1, SubMenu: [] },
          { title: '組選 3', SubMenu: [] },
          { title: '組選 6', SubMenu: [] },
          { title: '過關', SubMenu: [] },
          { title: '雜項', SubMenu: [] },
          { title: '其他', SubMenu: [] }
        ]
      },
      Item: {
        '1': { title: '一定位-個' },
        '2': { title: '一定位-個單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '3': { title: '一定位-個大小', shortT: '', subtitle: [ '大', '小' ] },
        '4': { title: '一定位-拾' },
        '5': { title: '一定位-拾單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '6': { title: '一定位-拾大小', shortT: '', subtitle: [ '大', '小' ] },
        '7': { title: '一定位-佰' },
        '8': { title: '一定位-佰單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '9': { title: '一定位-佰大小', shortT: '', subtitle: [ '大', '小' ] },
        '10': { title: '一字組合' },
        '11': { title: '三字和數' },
        '12': { title: '三字和數單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '13': { title: '三字和數大小', shortT: '', subtitle: [ '大', '小' ] },
        '14': { title: '二定位拾個' },
        '15': { title: '二定位佰個' },
        '16': { title: '二定位佰拾' },
        '17': { title: '二字组合' },
        '18': { title: '組 3全包', shortT: '', subtitle: [ '全包', '' ] },
        '19': { title: '組 3轉直-5', shortT: '5號' },
        '20': { title: '組 3轉直-6', shortT: '6號' },
        '21': { title: '組 3轉直-7', shortT: '7號' },
        '22': { title: '組 3轉直-8', shortT: '8號' },
        '23': { title: '組 6轉直-4', shortT: '4號' },
        '24': { title: '組 6轉直-5', shortT: '5號' },
        '25': { title: '組 6轉直-6', shortT: '6號' },
        '26': { title: '組 6轉直-7', shortT: '7號' },
        '27': { title: '組 6轉直-8', shortT: '8號' },
        '28': { title: '3x3x3', shortT: '', subtitle: [ '' ] },
        '29': { title: '4x4x4', shortT: '', subtitle: [ '' ] },
        '30': { title: '5x5x5', shortT: '', subtitle: [ '' ] },
        '31': { title: '6x6x6', shortT: '', subtitle: [ '' ] },
        '32': { title: '7x7x7', shortT: '', subtitle: [ '' ] },
        '33': { title: '中 3 保 3', shortT: '', subtitle: [ '' ] },
        '34': { title: '一定位-個質合', shortT: '', subtitle: [ '質', '合' ] },
        '35': { title: '一定位-拾質合', shortT: '', subtitle: [ '質', '合' ] },
        '36': { title: '一定位-佰質合', shortT: '', subtitle: [ '質', '合' ] },
        '37': {
          title: '定位單雙過關',
          shortT: '',
          subtitle: [
            '單單單', '單單雙',
            '單雙雙', '單雙單',
            '雙雙雙', '雙雙單',
            '雙單單', '雙單雙'
          ]
        },
        '38': {
          title: '定位大小過關',
          shortT: '',
          subtitle: [
            '大大大', '大大小',
            '大小小', '大小大',
            '小小小', '小小大',
            '小大大', '小大小'
          ]
        },
        '39': {
          title: '定位質合過關',
          shortT: '',
          subtitle: [
            '質質質', '質質合',
            '質合合', '質合質',
            '合合合', '合合質',
            '合質質', '合質合'
          ]
        },
        '40': { title: '跨度' },
        '41': { title: '合值' },
        '42': { title: '三定位' },
        '43': { title: '三字组合' },
        '44': {
          title: '拾個和數',
          shortT: '',
          subtitle: [
            '',   '',    '',
            '',   '0~4', '5',
            '6',  '7',   '8',
            '9',  '10',  '11',
            '12', '13',  '14~18'
          ]
        },
        '45': {
          title: '佰個和數',
          shortT: '',
          subtitle: [
            '',   '',    '',
            '',   '0~4', '5',
            '6',  '7',   '8',
            '9',  '10',  '11',
            '12', '13',  '14~18'
          ]
        },
        '46': {
          title: '佰拾和數',
          shortT: '',
          subtitle: [
            '',   '',    '',
            '',   '0~4', '5',
            '6',  '7',   '8',
            '9',  '10',  '11',
            '12', '13',  '14~18'
          ]
        },
        '47': { title: '拾個和數單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '48': { title: '佰個和數單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '49': { title: '佰拾和數單雙', shortT: '', subtitle: [ '單', '雙' ] },
        '50': { title: '拾個和數尾數' },
        '51': { title: '佰個和數尾數' },
        '52': { title: '佰拾和數尾數' },
        '53': { title: '拾個和數尾數大小', shortT: '', subtitle: [ '大', '小' ] },
        '54': { title: '佰個和數尾數大小', shortT: '', subtitle: [ '大', '小' ] },
        '55': { title: '佰拾和數尾數大小', shortT: '', subtitle: [ '大', '小' ] },
        '56': { title: '拾個和數尾數質合', shortT: '', subtitle: [ '質', '合' ] },
        '57': { title: '佰個和數尾數質合', shortT: '', subtitle: [ '質', '合' ] },
        '58': { title: '佰拾和數尾數質合', shortT: '', subtitle: [ '質', '合' ] },
        '59': { title: '雜六', shortT: '', subtitle: [ '雜六', '' ] },
        '60': { title: '順子', shortT: '', subtitle: [ '順子', '' ] },
        '61': { title: '豹子', shortT: '', subtitle: [ '豹子', '' ] },
        '62': { title: '不出' },
        '63': { title: '對子', shortT: '', subtitle: [ '對子', '' ] },
        '64': { title: '准對' },
        '65': { title: '半順', shortT: '', subtitle: [ '半順', '' ] },
        '66': { title: '殺號' }
      }
    },
    Speed3: {
      Menu: {
        Group: [
          { title: '大小全骰', SubItem: [] },
          { title: '三軍', SubItem: [] },
          { title: '圍骰', SubMenu: [] },
          { title: '短牌', SubMenu: [] },
          { title: '點數', SubMenu: [] },
          { title: '長牌', SubMenu: [] }
        ]
      },
      Item: {
        '1': { title: '三軍' },
        '2': { title: '大小', subtitle: [ '大', '小' ] },
        '3': {
          title: '圍骰',
          subtitle: [
            '',    '111',
            '222', '333',
            '444', '555',
            '666'
          ]
        },
        '4': { title: '全骰', subtitle: [ '全骰', '' ] },
        '5': { title: '點數' },
        '6': {
          title: '長牌',
          subtitle: [
            '12', '13', '14', '15',
            '16', '23', '24', '25',
            '26', '34', '35', '36',
            '45', '46', '56'
          ]
        },
        '7': {
          title: '短牌',
          subtitle: [
            '',   '11', '22',
            '33', '44', '55',
            '66'
          ]
        }
      }
    },
    Happy8: {
      Menu: {
        Group: [
          { title: '總和五行', SubItem: [] },
          { title: '正碼', SubItem: [] }
        ]
      },
      Item: {
        '1': { title: '正碼' },
        '2': { title: '總和大小', shortT: '總和', subtitle: [ '大', '小' ] },
        '3': { title: '總和單雙', shortT: '總和', subtitle: [ '單', '雙' ] },
        '4': { title: '總和810', shortT: '總和', subtitle: [ '810', '' ] },
        '5': {
          title: '總和過關',
          shortT: '',
          subtitle: [ '大單', '大雙', '小單', '小雙' ]
        },
        '6': {
          title: '前後和',
          shortT: '',
          subtitle: [ '前(多)', '後(多)', '前後(和)' ]
        },
        '7': {
          title: '單雙和',
          shortT: '',
          subtitle: [ '單(多)', '雙(多)', '單雙(和)' ]
        },
        '8': {
          title: '五行',
          shortT: '',
          subtitle: [ '金', '木', '水', '火', '土' ]
        }
      }
    }
  }
}
