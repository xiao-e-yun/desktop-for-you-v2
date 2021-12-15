import builder from './builder/node';
import { Prop, TextLang } from './builder/node/config/prop_type';
const ignore = true

builder.config.builder({
  title: 'Desktop For You v2',
  audio: true,
  type: "Web",
  contentrating: "Everyone",
  visibility: "friends",
  description: 'Not to give up high performance and at the same time,\nThe first choice to ensure scalability and stability.\n\nThe tree-like setting menu makes it easier to find functions\nAutomatically limit fps, reduce CPU power consumption\n\n\nSupport settings\n√ Custom style\n√ Background\n√ Clock\n√ Calendar\n√ Logo\n√ Visualization\n√ Developer mode',
  preview: "preview.jpg",
  tags: ["Relaxing"],
  workshopid: "2670119805",
}, [

  {
    ignore,
    id: "tips",
    text: {
      "zh-cht": "提示",
      "zh-chs": "提示",
      "en-us": "Tips",
    },
    type: "tips",
    list: [
      {
        "zh-cht": "翻轉桌面時所以文字都會自動調整",
        "zh-chs": "翻转桌面时所有文字都会自动调整",
        "en-us": "All text will automatically adjust when flip the desktop",
      },
      {
        "zh-cht": "發現問題時，請到<a href='https://steamcommunity.com/sharedfiles/filedetails/?id=2670119805'>工作坊</a>留言問題",
        "zh-chs": "发现问题时，请到<a href='https://steamcommunity.com/sharedfiles/filedetails/?id=2670119805'>工作坊</a>留言问题",
        "en-us": "Please leave a message in the <a href='https://steamcommunity.com/sharedfiles/filedetails/?id=2670119805'>workshop</a> when you find a bug",
      },
      {
        "zh-cht": "啟用特效時，會自動限制FPS<br><pre>Wallpaper Engine/設定/畫質/FPS</pre>",
        "zh-chs": "启用特效时，会自动限制FPS<br><pre>Wallpaper Engine/设置/品质/FPS</pre>",
        "en-us": "When enabling effects, the FPS will be automatically limited<br><pre>Wallpaper Engine/Settings/Quality/FPS</pre>",
      },
      {
        "zh-cht": "如果喜歡的話，請留下評價<img src='https://static.xiaoeyun.me/img/%E5%BD%88%E7%8F%A0%E6%B1%BD%E6%B0%B4.png' width='100%'>",
        "zh-chs": "如果喜欢的话，请留下评价<img src='https://static.xiaoeyun.me/img/%E5%BD%88%E7%8F%A0%E6%B1%BD%E6%B0%B4.png' width='100%'>",
        "en-us": "If you like, please leave a review<img src='https://static.xiaoeyun.me/img/%E5%BD%88%E7%8F%A0%E6%B1%BD%E6%B0%B4.png' width='100%' >",
      },
    ],
  },

  {
    id: "style",
    type: 'combo',
    icon: "fa-desktop",
    text: {
      "zh-cht": "桌布風格",
      "zh-chs": "桌布风格",
      "en-us": "Desktop Style",
    },
    value: "",
    options: [
      {
        label: {
          "zh-cht": "默認",
          "zh-chs": "默认",
          "en-us": "Default",
        },
        value: "",
      },
      {
        label: {
          "zh-cht": "霓虹",
          "zh-chs": "霓虹",
          "en-us": "Neon",
        },
        value: "neon",
      }
    ],
  },

  {
    icon: "fa-bars",
    id: "menu",
    type: "menu",
    text: {
      "zh-cht": "選單",
      "zh-chs": "选单",
      "en-us": "Menu",
    },
    all: {
      "zh-cht": "全部顯示",
      "zh-chs": "全部显示",
      "en-us": "Show all",
    },
    value: -1,
    options: [



      {
        label: {
          "zh-cht": "背景",
          "zh-chs": "背景",
          "en-us": "Background",
        },
        value: [
          {
            id: "bg_title",
            text: {
              "zh-cht": "<h2>背景<small>Background</small></h2>",
              "zh-chs": "<h2>背景<small>Background</small></h2>",
              "en-us": "<h1>Background</h1>",
            },
          },
          {
            id: "bg_color",
            type: "color",
            text: {
              "zh-cht": "顏色",
              "zh-chs": "颜色",
              "en-us": "Color",
            },
            value: "0 0 0",
          },
          {
            id: "bg_file",
            type: "menu",
            text: {
              "zh-cht": "圖片/影像",
              "zh-chs": "图片/影像",
              "en-us": "Image/Video",
            },
            value: 1,
            options: [
              {
                label: {
                  "zh-cht": "純色",
                  "zh-chs": "纯色",
                  "en-us": "Pure Color",
                },
                value: []
              },
              {
                label: {
                  "zh-cht": "圖片",
                  "zh-chs": "图片",
                  "en-us": "Image",
                },
                value: [
                  {
                    id: "img",
                    type: "item",
                    custom: {
                      type: "file",
                      value: undefined,
                    },
                    text: {
                      "zh-cht": " 檔案",
                      "zh-chs": " 文件",
                      "en-us": " File",
                    },
                    list: [
                      {
                        id: "size",
                        type: "combo",
                        text: {
                          "zh-cht": "  填充方式",
                          "zh-chs": "  填充方式",
                          "en-us": "Filling method",
                        },
                        value: "cover",
                        options: [
                          {
                            label: {
                              "zh-cht": "裁減圖片以填滿",
                              "zh-chs": "裁剪图片以填满",
                              "en-us": "Crop the image to fill",
                            },
                            value: "cover",
                          },
                          {
                            label: {
                              "zh-cht": "以原圖片大小填滿",
                              "zh-chs": "以原图片大小填满",
                              "en-us": "Fill in the original image size",
                            },
                            value: "auto",
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: {
                  "zh-cht": "影片",
                  "zh-chs": "影片",
                  "en-us": "Video",
                },
                value: [
                  {
                    id: "video",
                    type: "item",
                    custom: {
                      type: "file",
                      fileType: "video",
                      value: undefined,
                    },
                    text: {
                      "zh-cht": " 檔案",
                      "zh-chs": " 文件",
                      "en-us": " File",
                    },
                    list: [
                      {
                        id: "size",
                        type: "combo",
                        text: {
                          "zh-cht": "  填充方式",
                          "zh-chs": "  填充方式",
                          "en-us": "Filling method",
                        },
                        value: "cover",
                        options: [
                          {
                            label: {
                              "zh-cht": "裁減圖片以填滿",
                              "zh-chs": "裁剪图片以填满",
                              "en-us": "Crop the image to fill",
                            },
                            value: "cover",
                          },
                          {
                            label: {
                              "zh-cht": "以原圖片大小填滿",
                              "zh-chs": "以原图片大小填满",
                              "en-us": "Fill in the original image size",
                            },
                            value: "auto",
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: {
                  "zh-cht": "幻燈片/圖片",
                  "zh-chs": "幻灯片/图片",
                  "en-us": "Slideshow/Image",
                },
                value: [
                  {
                    id: "dir_img",
                    type: "item",
                    custom: {
                      mode: "fetchall",
                      type: "directory",
                      value: undefined,
                    },
                    text: {
                      "zh-cht": " 資料夾",
                      "zh-chs": " 资料夹",
                      "en-us": " Folder",
                    },
                    list: [
                      {
                        id: "size",
                        type: "combo",
                        text: {
                          "zh-cht": "  填充方式",
                          "zh-chs": "  填充方式",
                          "en-us": "Filling method",
                        },
                        value: "cover",
                        options: [
                          {
                            label: {
                              "zh-cht": "裁減圖片以填滿",
                              "zh-chs": "裁剪图片以填满",
                              "en-us": "Crop the image to fill",
                            },
                            value: "cover",
                          },
                          {
                            label: {
                              "zh-cht": "以原圖片大小填滿",
                              "zh-chs": "以原图片大小填满",
                              "en-us": "Fill in the original image size",
                            },
                            value: "auto",
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ]
      },



      panel("clock", {
        "zh-cht": "時鐘",
        "zh-chs": "时钟",
        "en-us": "Clock",
      },{
        size: 120,
        left: 68,
        top: 68,
      }, [
        {
          id: "second",
          type: "bool",
          value: true,
          text: {
            "zh-cht": "顯示秒",
            "zh-chs": "显示秒",
            "en-us": "Show second",
          },
        },
        {
          id: "military_time",
          type: "bool",
          value: true,
          text: {
            "zh-cht": "24小時制",
            "zh-chs": "24小时制",
            "en-us": "Military Time<small>24 Hour Time</small>",
          },
        },
      ]),



      panel("date", {
        "zh-cht": "日曆",
        "zh-chs": "日历",
        "en-us": "Calendar",
      },{
        size: 56,
        left: 74,
        top: 59,
      } ,[
        {
          id: "week",
          type: "item",
          value: true,
          text: {
            "zh-cht": "顯示星期",
            "zh-chs": "显示星期",
            "en-us": "Show week",
          },
          list: [
            {
              id: "format",
              type: "combo",
              value: "en",
              text: {
                "zh-cht": " 格式",
                "zh-chs": " 格式",
                "en-us": " Format",
              },
              options: [
                {
                  label: {
                    "zh-cht": "英文",
                    "zh-chs": "英文",
                    "en-us": "English",
                  },
                  value: "en",
                },
                {
                  label: {
                    "zh-cht": "中文",
                    "zh-chs": "中文",
                    "en-us": "Chinese",
                  },
                  value: "zh",
                },
                {
                  label: {
                    "zh-cht": "日文",
                    "zh-chs": "日文",
                    "en-us": "Japanese",
                  },
                  value: "jp",
                },
              ]
            }

          ]
        }
      ]),



      {
        label: {
          "zh-cht": "標誌",
          "zh-chs": "标志",
          "en-us": "Logo",
        },
        value: [
          {
            id: "logo",
            type: "item",
            value: true,
            text: {
              "zh-cht": "<h1>標誌<small>Logo</small></h1>",
              "zh-chs": "<h1>标志<small>Logo</small></h1>",
              "en-us": "<h1>Logo</h1>",
            },
            list: [
              {
                id: "file",
                type: "file",
                text:{
                  "zh-cht": "檔案",
                  "zh-chs": "文件",
                  "en-us": "File",
                },
                value: "",
              },
              pos(true,{left: 39, top: 34}),
              shadow(true),
              {
                id: "width",
                type: "slider",
                max: 150,
                step: .2,
                min: 0,
                value: 45,
                text: {
                  "zh-cht": "大小<small>%</small>",
                  "zh-chs": "大小<small>%</small>",
                  "en-us": "Size<small>%</small>",
                },
              },
              {
                id: "z-index",
                type: "bool",
                value: true,
                text: {
                  "zh-cht": "顯示在最上層",
                  "zh-chs": "显示在最上层",
                  "en-us": "Show on top",
                },
              }
            ]
          }
        ],
      },

      {
        label: {
          "zh-cht": "音效可視化",
          "zh-chs": "音效可视化",
          "en-us": "Visualization",
        },
        value: [
          {
            id: "visualization",
            type: "item",
            value: true,
            text: {
              "zh-cht": "<h2>音效可視化<small>Visualization</small></h2>",
              "zh-chs": "<h2>音效可视化<small>Visualization</small></h2>",
              "en-us": "<h1>Visualization</h1>",
            },
            list: [




              {
                id: "color",
                type: "menu",
                value: 1,
                text: {
                  "zh-cht": "顏色",
                  "zh-chs": "颜色",
                  "en-us": "Color",
                },
                options: [

                  {
                    label: {
                      "zh-cht": "單色",
                      "zh-chs": "单色",
                      "en-us": "Single Color",
                    },
                    value: [
                      {
                        id: "color",
                        type: "color",
                        value: "241 218 196",
                        text: {
                          "zh-cht": " 色調",
                          "zh-chs": " 色调",
                          "en-us": " Tone",
                        }
                      }
                    ],
                  },



                  {
                    label: {
                      "zh-cht": "雙色",
                      "zh-chs": "双色",
                      "en-us": "Double Color",
                    },
                    value: [

                      {
                        id: "one-color",
                        type: "color",
                        value: "241 218 196",
                        text: {
                          "zh-cht": " 第一色調",
                          "zh-chs": " 第一色调",
                          "en-us": " First Tone",
                        }
                      },

                      {
                        id: "two-color",
                        type: "color",
                        value: "136 136 136",
                        text: {
                          "zh-cht": " 第二色調",
                          "zh-chs": " 第二色调",
                          "en-us": " Second Tone",
                        }
                      },

                    ],
                  }

                ],
              },

              {
                id: "alpha",
                type: "slider",
                max: 100,
                step: 1,
                min: 1,
                value: 100,
                text: {
                  "zh-cht": "透明度<small>%</small>",
                  "zh-chs": "透明度<small>%</small>",
                  "en-us": "Alpha<small>%</small>",
                },
              },

              {
                id: "quantity",
                type: "slider",
                value: 100,
                max: 128,
                step: 2,
                min: 16,
                text: {
                  "zh-cht": "數量<small>個</small>",
                  "zh-chs": "数量<small>个</small>",
                  "en-us": "Quantity",
                }
              },


              {
                id: "amplitude",
                type: "slider",
                max: 10,
                value: 1,
                step: 1,
                min: 1,
                text: {
                  "zh-cht": "振幅<small>倍</small>",
                  "zh-chs": "振幅<small>倍</small>",
                  "en-us": "Amplitude",
                }
              },


              {
                id: "width",
                type: "slider",
                max: 25,
                step: 1,
                min: 1,
                value: 6,
                text: {
                  "zh-cht": "寬度<small>px</small>",
                  "zh-chs": "宽度<small>px</small>",
                  "en-us": "Width<small>px</small>",
                }
              },


              {
                id: "spacing",
                type: "slider",
                max: 12,
                step: 1,
                min: 0,
                value: 3,
                text: {
                  "zh-cht": "間距<small>px</small>",
                  "zh-chs": "间距<small>px</small>",
                  "en-us": "Spacing<small>px</small>",
                }
              },


              {
                id: "cap",
                type: "combo",
                value: "round",
                text: {
                  "zh-cht": "頂點形狀",
                  "zh-chs": "顶点形状",
                  "en-us": "Cap Shape",
                },
                options: [
                  {
                    label: {
                      "zh-cht": "圓形",
                      "zh-chs": "圆形",
                      "en-us": "Round",
                    },
                    value: "round",
                  },

                  {
                    label: {
                      "zh-cht": "方形",
                      "zh-chs": "方形",
                      "en-us": "Square",
                    },
                    value: "butt", // butt, square 差不多
                  },
                ]
              },


              {
                id: "shadow",
                type: "item",
                value: false,
                text: {
                  "zh-cht": "陰影",
                  "zh-chs": "阴影",
                  "en-us": "Shadow",
                },
                list: [

                  {
                    id: "color",
                    type: "color",
                    value: "0 0 0",
                    text: {
                      "zh-cht": " 色調",
                      "zh-chs": " 色调",
                      "en-us": " Tone",
                    },
                  },

                  {
                    id: "alpha",
                    type: "slider",
                    max: 100,
                    value: 100,
                    min: 0,
                    step: 1,
                    text: {
                      "zh-cht": " 透明度<small>%</small>",
                      "zh-chs": " 透明度<small>%</small>",
                      "en-us": " Alpha<small>%</small>",
                    },
                  },

                  {
                    id: "blur",
                    type: "slider",
                    max: 25,
                    value: 12,
                    step: 1,
                    min: 0,
                    text: {
                      "zh-cht": " 模糊",
                      "zh-chs": " 模糊",
                      "en-us": " Blur",
                    },
                  },


                ],
              },

              pos(false,{
                left:1,
                top:95,
              })
            ]
          },
        ],
      },


      {
        label: {
          "zh-cht": "其他",
          "zh-chs": "其他",
          "en-us": "Other",
        },
        value: [
          {
            id: "other",
            text: {
              "zh-cht": "<h2>其他<small>Other</small></h2>",
              "zh-chs": "<h2>其他<small>Other</small></h2>",
              "en-us": "<h1>Other</h1>",
            }
          },
          {
            type: "bool",
            value: false,
            id: "dev_tools",
            text: {
              "zh-cht": "開發者模式",
              "zh-chs": "开发者模式",
              "en-us": "Developer mode",
            }
          },
          {
            type: "bool",
            value: false,
            id: "force_fixed_fps",
            text: {
              "zh-cht": "強制固定FPS <small>(提高無特效時占用率)</small>",
              "zh-chs": "强制固定FPS <small>(提高无特效时占用率)</small>",
              "en-us": "Force fixed FPS <small>(Increase the CPU usage without FX)</small>",
            }
          }
        ]
      },



    ],
    fixed_order: true,
  },

], {
  out_config: "public/project.json",
  out_types: "types.json",
  custom: {
    general: {
      properties: {
        _d1: {
          order: 1,
          type: "divider",
          text: "ui_$divider_1",
        },
        schemecolor: {
          condition: "false",
        },
        alignmentfliph: { condition: "false" }, //會有html翻轉問題
        wec_e: { condition: "false", },
        browse_settings: {
          icon: "fa-cog",
          order: -15,
          text: "ui_$browse_settings",
          type: "bool",
          value: false
        },
        flip: {
          icon: "fa-exchange",
          condition: "browse_settings.value === true",
          order: -12,
          text: "ui_browse_properties_alignment_flip_horizontally",
          type: "bool",
          value: false
        },
        wec_brs: {
          icon: 'fa-sun',
          condition: "browse_settings.value === true",
          max: 100,
          min: 0,
          text: "ui_browse_properties_brightness",
          type: "slider",
          value: 50
        },
        wec_con: {
          icon: 'fa-adjust',
          condition: "browse_settings.value === true",
          max: 100,
          min: 0,
          text: "ui_browse_properties_contrast",
          type: "slider",
          value: 50
        },
        wec_hue: {
          icon: 'fa-palette',
          condition: "browse_settings.value === true",
          max: 100,
          min: 0,
          text: "ui_browse_properties_hue_shift",
          type: "slider",
          value: 50
        },
        wec_sa: {
          icon: 'fa-tint',
          condition: "browse_settings.value === true",
          max: 100,
          min: 0,
          text: "ui_browse_properties_saturation",
          type: "slider",
          value: 50
        }
      },
      localization:{
        "zh-cht":{
          ui_$browse_settings: "系統配置",
          ui_$divider_1: "桌布設置&nbsp;",
        },
        "zh-chs":{
          ui_$browse_settings: "系统配置",
          ui_$divider_1: "桌布设置&nbsp;",
        },
        "en-us":{
          ui_$browse_settings: "System Settings",
          ui_$divider_1: "Wallpaper Settings&nbsp;",
        },
      }
    },
  }
})


function panel(id: string, text: TextLang, base_setting:{
  size: number,
  left: number,
  top: number,
} , props: Prop[] = []) {
  let title: TextLang = {}
  if (typeof text === "string") title = `<h1>${text}</h1>`
  else for (const lang in text) 
    title[lang] = lang === "en-us" ?
      `<h1>${text[lang]}</h1>` :
      `<h2>${text[lang]}<small>${text["en-us"] || ""}</small></h2>`
  

  return {
    label: text,
    value: [
      {
        id: id,
        type: "item",
        text: title,
        value: true,
        list: ([
          {
            ignore,
            id: "bg",
            type: "item",
            text: {
              "zh-cht": "背景設置",
              "zh-chs": "背景設置",
              "en-us": "Background setting",
            },
            value: false,
            list: [



              {
                ignore,
                id: "color",
                type: "color",
                text: {
                  "zh-cht": " 顏色",
                  "zh-chs": " 颜色",
                  "en-us": " Color",
                },
                value: "21 26 50",
              },


              {
                ignore,
                id: "opacity",
                type: "slider",
                max: 100,
                min: 0,
                step: 1,
                value: 80,
                text: {
                  "zh-cht": " 透明度<small>%</small>",
                  "zh-chs": " 透明度<small>%</small>",
                  "en-us": " Opacity<small>%</small>",
                },
              },


              {
                ignore,
                id: "img",
                type: "file",
                text: {
                  "zh-cht": " 圖片",
                  "zh-chs": " 图片",
                  "en-us": " Image",
                },
              },


              {
                ignore,
                id: "blur",
                type: "slider",
                max: 24,
                min: 0,
                step: 1,
                value: 6,
                text: {
                  "zh-cht": " 模糊<small>px</small>",
                  "zh-chs": " 模糊<small>px</small>",
                  "en-us": " Blur<small>px</small>",
                },
              },



            ]
          },
          shadow(),
          {
            ignore,
            id: "border",
            type: "item",
            text: {
              "zh-cht": "邊框設置",
              "zh-chs": "边框设置",
              "en-us": "Border setting",
            },
            value: false,
            list: [



              {
                ignore,
                id: "color",
                type: "color",
                text: {
                  "zh-cht": " 顏色",
                  "zh-chs": " 颜色",
                  "en-us": " Color",
                },
                value: "241 218 196",
              },


              {
                ignore,
                id: "opacity",
                type: "slider",
                max: 100,
                min: 0,
                step: 1,
                value: 100,
                text: {
                  "zh-cht": " 透明度<small>%</small>",
                  "zh-chs": " 透明度<small>%</small>",
                  "en-us": " Opacity<small>%</small>",
                },
              },


              {
                ignore,
                id: "width",
                type: "slider",
                max: 12,
                min: 0,
                step: 1,
                value: 2,
                text: {
                  "zh-cht": " 寬度<small>px</small>",
                  "zh-chs": " 宽度<small>px</small>",
                  "en-us": " Width<small>px</small>",
                },
              },



            ]
          },
          pos(false,{
            left:base_setting.left,
            top:base_setting.top
          }),
          {
            ignore,
            id: "size",
            type: "slider",
            max: 160,
            min: 12,
            step: 2,
            value: base_setting.size,
            text: {
              "zh-cht": "大小<small>px</small>",
              "zh-chs": "大小<small>px</small>",
              "en-us": "Size<small>px</small>",
            },
          },
          {
            ignore,
            id: "color",
            type: "color",
            text: {
              "zh-cht": "顏色",
              "zh-chs": "颜色",
              "en-us": "Color",
            },
            value: "241 218 196",
          },
        ] as Prop[]).concat(props)
      }
    ] as Prop[]
  }
}

function pos(
  over: boolean = false,
  pos:{left: number, top: number} = {left: 0, top: 0}
) {
  const size = {
    type: "slider",
    max: 100,
    min: over ? -50 : 0,
    step: .2,
  }

  return {
    ignore,
    id: "pos",
    type: "item",
    text: {
      "zh-cht": "位置設置",
      "zh-chs": "位置设置",
      "en-us": "Position setting",
    },
    value: false,
    list: [
      {
        ignore,
        id: "left",
        ...size,
        value: pos.left,
        text: {
          "zh-cht": " 距離左邊<small>%</small>",
          "zh-chs": " 距离左边<small>%</small>",
          "en-us": " To the left<small>%</small>",
        }
      },
      {
        ignore,
        id: "top",
        ...size,
        value: pos.top,
        text: {
          "zh-cht": " 距離上方<small>%</small>",
          "zh-chs": " 距离上方<small>%</small>",
          "en-us": " To the top<small>%</small>",
        }
      }
    ]
  }
}

function shadow(drop: boolean = false) {
  return {
    ignore,
    id: (drop ? "drop_" : "") + "shadow",
    type: "item",
    text: {
      "zh-cht": "陰影設置",
      "zh-chs": "阴影设置",
      "en-us": "Shadow setting",
    },
    value: false,
    list: [



      {
        ignore,
        id: "color",
        type: "color",
        text: {
          "zh-cht": " 顏色",
          "zh-chs": " 颜色",
          "en-us": " Color",
        },
        value: "13 12 29",
      },


      {
        ignore,
        id: "opacity",
        type: "slider",
        max: 100,
        min: 0,
        step: 1,
        value: 100,
        text: {
          "zh-cht": " 透明度<small>%</small>",
          "zh-chs": " 透明度<small>%</small>",
          "en-us": " Opacity<small>%</small>",
        },
      },


      {
        ignore,
        id: "width",
        type: "slider",
        max: 60,
        min: 0,
        step: 1,
        value: 12,
        text: {
          "zh-cht": " 範圍<small>px</small>",
          "zh-chs": " 范围<small>px</small>",
          "en-us": " Range<small>px</small>",
        },
      },



    ]
  }
}
