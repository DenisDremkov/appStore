
1465064688024 - сегодня
1433528688024 - год назад
[
'{{repeat(200)}}',

  {
    user : '{{firstName()}}',
    dateMilisec : '{{integer(1433528688024, 1465064688024)}}',
    text : '{{lorem(20, "words")}}'
  }
] 




[
  '{{repeat(20)}}',

  
  
 
  {
      kind : '{{random("tablet", "laptop")}}',
      brand : '{{random("acer", "alcatel", "asus", "benq", "fly", "htc", "huawei", "lenovo", "lg", "meizu", "prestigio", "samsung", "sony")}}',
      model : '{{lorem(1, "words")}}',
      guarantee : '{{random(6, 12, 18, 24, 36)}}',
      price : '{{integer(2000, 10000)}}',
      operSystem : '{{random("Android 4.0", "Android 4.05", "Android 4.1", "Android 4.2", "Android 4.2")}}',
      cpu : '{{random("Core 2", "Pentium 5", "Intel 2.0", "Artron", "Core 3 Duo")}}',
      numCores : '{{integer(2, 8)}}',
      memory : '{{integer(4, 40)}}',
      ramMemory : '{{random(512, 1024, 2048)}}',
      screenDiagonal : '{{floating(4, 10, 1)}}',
      screenResolution : '{{random("1024*678", "1024*512", "2048*1024")}}',
      frontCamera : '{{floating(0.5, 3, 1)}}',
      mainCamera : '{{integer(4, 15)}}',
      battery : '{{integer(2000, 4000)}}',
      colours : [
        
        '{{random("#111", "#333", "#999")}}',
        '{{random("#444", "#555", "#777")}}',
        '{{random("#666", "#888", "#222")}}' 
      ],
      img : {
        small : '{{integer(1, 10)}}'+'.png',
        big : '{{integer(1, 10)}}'+'.png',
        slide1 : '{{integer(1, 10)}}'+'.png',
        slide2 : '{{integer(1, 10)}}'+'.png',
        slide3 : '{{integer(1, 10)}}'+'.png',
        slide4 : '{{integer(1, 10)}}'+'.png'
      },
      sale : {
        bool : '{{random(true, false)}}',
        discount : '{{integer(1, 10)}}',
        descript : '{{lorem(20, "words")}}'
      },
  raiting : {
    val : 1,
    num : 1,
    sum : 1
  },


  comments : {
    sumComments : 2,
    comments : [
          '{{repeat(2)}}',
          {
          user: '{{firstName()}} {{surname()}}',
          date: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss Z")}}',
          text: '{{lorem(20, "words")}}'
          }
        ]
  }
  }
]
    "laptop": {
        "price" : {
            "rus" : "Цена, грн.",
            "min": 2001,
            "max": 10001
        },
         "raiting" : {
            "rus" : "Рейтинг, звезды",
            "min": 0,
            "max": 5
        },
        "screenDiagonal" : {
            "rus" : "Диагональ экрана, дюймы",
            "min": 4,
            "max": 11
        },
        "numCores" : {
            "rus" : "Колличество ядер, шт.",
            "min": 1,
            "max": 9
        },
        "frontCamera" :{
            "rus" : "Фронтальная камера, Mpx.",
            "min": 0.2,
            "max": 4
        },
        "mainCamera" : {
            "rus" : "Тыловая камера, Mpx.",
            "min": 3,
            "max": 16
        },
        "memory" : {
            "rus" : "Память, Gb",
            "min": 3,
            "max": 41
        },   
         "ramMemory" : {
            "rus" : "Оперативная память, Mb.",
            "min": 511,
            "max": 2049
        }    
    },
    "tablet": {
                "price" : {
            "rus" : "Цена, грн.",
            "min": 2000,
            "max": 10000
        },
         "raiting" : {
            "rus" : "Рейтинг, звезды",
            "min": 0,
            "max": 5
        },
        "screenDiagonal" : {
            "rus" : "Диагональ экрана, дюймы",
            "min": 4,
            "max": 10
        },
        "numCores" : {
            "rus" : "Колличество ядер, шт.",
            "min": 2,
            "max": 8
        },
        "frontCamera" :{
            "rus" : "Фронтальная камера, Mpx.",
            "min": 0.5,
            "max": 3
        },
        "mainCamera" : {
            "rus" : "Тыловая камера, Mpx.",
            "min": 4,
            "max": 15
        },
        "memory" : {
            "rus" : "Память, Gb",
            "min": 4,
            "max": 40
        },   
         "ramMemory" : {
            "rus" : "Оперативная память, Mb.",
            "min": 512,
            "max": 2048
        }    
    },
[
  '{{repeat(1, 50)}}',

  
  
  {
    brend: '{{random("acer", "alcatel", "asus", "benq", "fly", "htc", "huawei", "lenovo", "lg", "meizu", "prestigio", "samsung", "sony")}}',
    model: '{{lorem(1, "words")}}',
    processor: '{{integer(3, 10)}}',
    display: '{{floating(4, 10, 1)}}',
    camera: '{{integer(5, 15)}}',
    memory: '{{integer(4, 16)}}',
    color: ['{{random("#3F3CFF", "#C423FF", "#FF2391", "#000")}}','{{random("#FF4B1E", "#FFD641", "#82FF28", "#fff")}}'],
    otherDescr: '{{lorem(10, "words")}}',
    reiting: '{{integer(1, 5)}}',
    price: '{{integer(2000, 10000)}}',
    img: 'img/0.jpg',
      imgmore: "['img/1.jpg','img/2.jpg','img/3.jpg']",
    comments: [
      	'{{repeat(3)}}',
        {
         	user: '{{firstName()}} {{surname()}}',
            time: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss Z")}}',
            text: '{{lorem(7, "words")}}'
        }
    ]
  }
]