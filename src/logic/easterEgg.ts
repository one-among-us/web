import Swal from "sweetalert2"
import { toast, scheduledTask } from "./helper"

export function handleFlowerToast(name: string) {
    if (!localStorage.getItem("hasFlowered")) {
        localStorage.setItem("hasFlowered", "Meow")
        toast("花与秋叶", `${name}收到你的小花啦~`, "lollipop_1f36d.png", null, 64, 64, null)
    }
}

export function handleEasterEgg(userid: string) {
    const now = new Date()
    if ((now.getDate() == 1) && (now.getMonth() == 3) && (parseInt(localStorage.getItem('easterEggMode')) == 0) && (!localStorage.getItem('manualModify'))) {
        localStorage.setItem("easterEggMode", "1")
        localStorage.setItem("enabledByApril", "1")
    }
    else {
        if (localStorage.getItem("enabledByApril") && (!localStorage.getItem('manualModify'))) {
            localStorage.setItem("easterEggMode", "0")
        }
    }
    if (localStorage.getItem('lang') === 'en') return;
    if (!localStorage.getItem('easterEggMode')) return;
    if (parseInt(localStorage.getItem('easterEggMode')) == 0) return;
    if (userid == "MeowBot233") {
        if (!localStorage.getItem("isSeenMeowBot233")) {
            localStorage.setItem("isSeenMeowBot233", "找到了喵~")
            toast("找到了喵~", "诶? 找什么喵? ", "cat-face-emoji-2048x1828.png", null, 64, 57, null)
        }
        if ((now.getDate() == 15) && (now.getMonth() == 3)) {
            if (!localStorage.getItem("birthdayMeowBot233"))
                localStorage.setItem("birthdayMeowBot233", (now.getFullYear() - 1).toString())
            if (parseInt(localStorage.getItem("birthdayMeowBot233")) != now.getFullYear()) {
                localStorage.setItem("birthdayMeowBot233", now.getFullYear().toString())
                Swal.fire({
                    icon: null,
                    position: "center",
                    toast: false,
                    title: null,
                    html: "<p style=\"text-align: left\">我依然无数次想起你，生活在充满你的世界里，和你一起找寻生活的希望。</p><p style=\"text-align: left\">我依然无数次想起你的声音和笑容。</p><p style=\"text-align: left\">我依然无数次想着你，想起那时，还有那时，还有努力留住你的温度的那时。</p><p style=\"text-align: left\">我依然深爱着你，如同以前和未来，你爱我那般。</p><p style=\"text-align: left\">我的坊洛猫猫，晚安好梦，明天见。</p><p style=\"text-align: left\">以及，生日快乐，亲爱的，我们一起许个愿吧。</p><p style=\"text-align: right\">——雪絵 澪奈</p>",
                    timer: 30000,
                    showConfirmButton: false,
                    showCancelButton: false,
                    timerProgressBar: true,
                })
            }
        }
    }
    if ((userid == "Anilovr") || (userid == "noname3031") || (userid == "dogesir_")) {
        if (!localStorage.getItem("Betelgeuse"))
            localStorage.setItem("Betelgeuse", `["${userid}"]`)
        else {
            const betelgeuse = JSON.parse(localStorage.getItem("Betelgeuse")) as string[]
            if (!betelgeuse.includes(userid)) {
                betelgeuse.push(userid)
                localStorage.setItem("Betelgeuse", JSON.stringify(betelgeuse))
            }
            if (betelgeuse.includes("Anilovr") && betelgeuse.includes("noname3031") && betelgeuse.includes("dogesir_") && (!localStorage.getItem("BetelgeuseShown"))) {
                localStorage.setItem("BetelgeuseShown", "R.I.P.")
                toast("参宿四 ~Betelgeuse~", "R.I.P.  - Be resilient -", "betelgeuse.png", "url(/img/stardust.jpg)", 64, 64, '#f0f8ff')
            }
        }
    }
    if ((userid == "xuewulihuameng") || (userid == "Futajuhuacha") || (userid == "Xu_Yushu") || (userid == "Dethelly")) {
        if (!localStorage.getItem("ChongQing"))
            localStorage.setItem("ChongQing", `["${userid}"]`)
        else {
            const ch = JSON.parse(localStorage.getItem("ChongQing")) as string[]
            if (!ch.includes(userid)) {
                ch.push(userid)
                localStorage.setItem("ChongQing", JSON.stringify(ch))
            }
            if (ch.includes("xuewulihuameng") && ch.includes("Futajuhuacha") && ch.includes("Xu_Yushu") && ch.includes("Dethelly") && (!localStorage.getItem("ChongQingShown"))) {
                localStorage.setItem("ChongQingShown", "Fog")
                toast("嘉陵雾稠", "雾终将散去, 而我们终将看到彩虹", "bridge.png", "url(/img/fog.jpg)", 64, 47, null)
            }
        }
    }
    if ((userid == "yumao") || (userid == "Uekawakuyuurei") || (userid == "MizuharaNagisa")) {
        if (!localStorage.getItem("Boat"))
            localStorage.setItem("Boat", `["${userid}"]`)
        else {
            const boat = JSON.parse(localStorage.getItem("Boat")) as string[]
            if (!boat.includes(userid)) {
                boat.push(userid)
                localStorage.setItem("Boat", JSON.stringify(boat))
            }
            if (boat.includes("yumao") && boat.includes("Uekawakuyuurei") && boat.includes("MizuharaNagisa") && (!localStorage.getItem("Sea"))) {
                localStorage.setItem("Sea", "with you")
                toast("海色", "拔锚起航, 跨越闪耀泪光的海岸", "ship.png", "#0b2058ff", 64, 64, '#f0f8feff')
            }
        }
    }
    if ((userid == "yumao")) {
        const summaries = document.getElementsByTagName("summary")
        for (const v of summaries) {
            console.log(v)
            v.addEventListener('click', (e) => {
                console.log("summary" + e)
                if (!localStorage.getItem('detailsByYumao')) {
                    localStorage.setItem('detainsByYumao', 'forever.')
                    toast("往昔苦难", "因为妳而存在, 因为妳而不在, 要在啊......", "lifeline.png", "#EEEEEE88", 64, 64, null)
                }
            }, false)
        }
    }
    if (userid == "shihai4h") {
        scheduledTask(30000, () => {
            if ((window.location.pathname == "/profile/shihai4h/") || (window.location.pathname == "/profile/shihai4h")) {
                if (!localStorage.getItem("funeralFlowers")) {
                    localStorage.setItem("funeralFlowers", "shihai4h")
                    toast("葬花", "花谢花飞花满天, 红消香断有谁怜? ", "tumb.png", "url(/img/flowers.png)", 64, 64, null)
                }
            }
        })
    }
    if (userid == "Xu_Yushu") {
        scheduledTask(20000, () => {
            if ((window.location.pathname == "/profile/Xu_Yushu") || (window.location.pathname == "/profile/Xu_Yushu/")) {
                if (!localStorage.getItem("preferredName")) {
                    localStorage.setItem("preferredName", "we would never known")
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "未闻花名",
                        html: `<p style="text-align: left">我们仍未知道妳喜欢的名字, <br />正如我们从未知道那天所看见的花的名字</p>`,
                        iconHtml: `<img style="width: 64px;height: 64px;border: none" src="/img/clip.png"></img>`,
                        iconColor: "#00000000",
                        timer: 5000,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timerProgressBar: true
                    })
                }
            }
        })
    }
    if ((userid == "SevenBird") || (userid == "Considerate_cat") || (userid == "ttttsuuukikoo_")) {
        const rhythmKeyword = ["音游", "音遊", "Arc", "舞萌"]
        const ps = document.getElementsByTagName("p")
        for (const v of ps) {
            for (const i of rhythmKeyword) {
                if (v.innerHTML.includes(i) || v.innerText.includes(i)) {
                    v.addEventListener('click', () => {
                        if (!localStorage.getItem("rhythm"))
                            localStorage.setItem("rhythm", `["${userid}"]`)
                        const rhythm = JSON.parse(localStorage.getItem("rhythm")) as string[]
                        if (!rhythm.includes(userid)) {
                            rhythm.push(userid)
                            localStorage.setItem("rhythm", JSON.stringify(rhythm))
                        }
                        if (rhythm.includes("SevenBird") && rhythm.includes("Considerate_cat") && rhythm.includes("ttttsuuukikoo_") && (!localStorage.getItem("rhythmShown"))) {
                            localStorage.setItem("rhythmShown", "AP end")
                            toast("希望有个 All Perfect 的结局", " ~ All that I'm left with is your reminiscences ~ ", "musical-score.png", null, 64, 64, null)
                        }
                    }, false)
                }
            }
        }
    }
}