# 精緻桌面DesktopForYou v2
https://steamcommunity.com/sharedfiles/filedetails/?id=2670119805  
桌布的源代碼  
如果發現Bug請在留言或是在此提出 Issues  

手動建構

    npm install -g pnpm ts-node
    pnpm i
    cd builder
    pnpm i ; pnpm tools_build ; pnpm build
    pnpm build
    
build 完成後將會生成 dist  
使用 `mklink /D dist \steamapps\common\wallpaper_engine\projects\myprojects\MYPROJECT` 或是  
直接建構在 projects 底下
