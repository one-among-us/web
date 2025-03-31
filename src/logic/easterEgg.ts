import path from "path";
import Swal from "sweetalert2"
import {dataHost, t} from "./config"
import {scheduledTask, toast, getResponseSync, checkSubset, randint} from "./helper"
import {EasterEgg} from "@/logic/data";

const registedEggItem = [
    'hasFlowered', 'preferredName'
]

export function isEaster(): boolean {
    if (!localStorage.getItem('easterEggMode')) return false;
    return parseInt(localStorage.getItem('easterEggMode')) != 0;
}

function allShown(): boolean {
    for (const v of registedEggItem) {
        if (!localStorage.getItem(v))
            return false;
    }
    return true;
}

function achieveAll() {
    scheduledTask(5600, () => {
        if (allShown() && (!localStorage.getItem('allShown'))) {
            localStorage.setItem('allShown', 'wow')
            Swal.fire({
                title: t.easter_egg.all,
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 5000,
                timerProgressBar: true,
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: false,
                showDenyButton: false
            })
        } else {
            if (localStorage.getItem('allShown'))
                localStorage.removeItem('allShown')
        }
    })
}

export function handleFlowerToast(name: string) {
    if (localStorage.getItem('lang') === 'en') return;
    if (!localStorage.getItem('easterEggMode')) return;
    if (parseInt(localStorage.getItem('easterEggMode')) == 0) return;
    if (!localStorage.getItem("hasFlowered")) {
        localStorage.setItem("hasFlowered", "Meow")
        toast("花与秋叶", `${name}收到你的小花啦~`, "/img/lollipop_1f36d.png", null, 64, 64, null)
    }
}

export function handleBirthdayToast(name: string) {
    if (!localStorage.getItem('easterEggMode')) return;
    if (parseInt(localStorage.getItem('easterEggMode')) == 0) return;
    toast(t.birthday.happy, t.birthday.birthday.replace('{0}', name), "/img/cake.png", null, 64, 64, null)
}

export function handleEasterEgg(userid?: string) {
    const swal2 = document.getElementsByTagName('div')
    for (const v of swal2) {
        if (v.classList.contains('swal2-container'))
            return;
    }
    const now = new Date()
    if ((now.getDate() == 1) && (now.getMonth() == 3) && ((parseInt(localStorage.getItem('easterEggMode')) == 0) || (!localStorage.getItem('easterEggMode'))) && (!localStorage.getItem('manualModify'))) {
        localStorage.setItem("easterEggMode", "1")
        localStorage.setItem("enabledByApril", "1")
    } else {
        if (localStorage.getItem("enabledByApril") && (!localStorage.getItem('manualModify'))) {
            localStorage.setItem("easterEggMode", "0")
        }
    }
    if (localStorage.getItem('lang') === 'en') return;
    if (!localStorage.getItem('easterEggMode')) return;
    if (parseInt(localStorage.getItem('easterEggMode')) == 0) return;
    if (!userid) return;
    if (userid == "MeowBot233") {
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
    const eggs = JSON.parse(getResponseSync(dataHost + '/eggs.json')) as EasterEgg[];
    const checkmate = (egg: EasterEgg) => {
        if (!localStorage.getItem(egg.id)) localStorage.setItem(egg.id, `["${userid}"]`);
        const opened = JSON.parse(localStorage.getItem(egg.id)) as string[];
        if (!opened.includes(userid)) {
            opened.push(userid);
            localStorage.setItem(egg.id, JSON.stringify(opened));
        }
        if (checkSubset(opened, egg.userid) && checkSubset(egg.userid, opened)) {
            localStorage.setItem(egg.id + '_SHOWN', randint(0, 2147483647).toString());
            toast(egg.toast.title, egg.toast.text, egg.toast.img, egg.toast.background, egg.toast.width, egg.toast.height, egg.toast.color);
        }
        console.log(egg)
    }
    for (const egg of eggs) {
        registedEggItem.push(egg.id + '_SHOWN');
        switch (egg.type) {
            case "open": {
                if (egg.userid.includes(userid)) {
                    if (localStorage.getItem(egg.id + '_SHOWN')) break;
                    else checkmate(egg)
                }
                break;
            }
            case "tag": {
                if (egg.userid.includes(userid)) {
                    if (localStorage.getItem(egg.id + '_SHOWN')) break;
                    const elements = document.getElementsByTagName(egg.tag)
                    for (const v of elements) {
                        console.log(v)
                        v.addEventListener('click', (e) => {
                            console.log('tag' + e)
                            checkmate(egg)
                        })
                    }
                }
                break;
            }
            case "wait": {
                if (egg.userid.includes(userid)) {
                    if (localStorage.getItem(egg.id + '_SHOWN')) break;
                    scheduledTask(30000, () => {
                        if ((window.location.pathname == `/profile/${userid}`) || window.location.pathname == `/profile/${userid}/`) {
                            checkmate(egg)
                        }
                    })
                }
                break;
            }
            case "keyword": {
                if (egg.userid.includes(userid)) {
                    if (localStorage.getItem(egg.id + '_SHOWN')) break;
                    const ps = document.getElementsByTagName('p')
                    for (const v of ps) {
                        console.log(v)
                        for (const i of egg.keyword) {
                            if (v.innerHTML.includes(i) || v.innerText.includes(i)) {
                                v.addEventListener('click', () => {
                                    checkmate(egg)
                                })
                            }
                        }
                    }
                }
            }
        }
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
    achieveAll()
}