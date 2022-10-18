; (function (App) {
    if (!App) return false;
    var config = {
        name: "index",
        cache:"cMediaNews",      //cache anchor
        prefix: "i",
        max:10,                     //history max length
        cls: {
            entry: '',
            row: '',
            anchor: '',
            account:'',
            operation:'',
            thumbs:'',
            fav:'',
            block:'',
            add:'',             //add button class
        }
    };

    var icons={         // icons
        "block":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY2MDUwNzU4MzM0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ1ODMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTg1My4wMiAyNjEuMzhINzM2LjY3VjE3Ny4xQzczNi41NiA3OS40OSA2NjAuMTYgMC40IDU2NS44OSAwLjNIMTcwLjc4Qzc2LjUyIDAuNCAwLjExIDc5LjQ5IDAgMTc3LjF2NDA5LjAzYzAuMTEgOTcuNjEgNzYuNTEgMTc2LjcxIDE3MC43OSAxNzYuOGgxMTYuMzR2ODQuMjljMC4xMiA5Ny42IDc2LjUyIDE3Ni42OCAxNzAuNzggMTc2Ljc4aDM5NS4xMWM5NC4yNy0wLjExIDE3MC42Ny03OS4xOSAxNzAuNzgtMTc2Ljc5VjQzOC4xOGMtMC4xMS05Ny42MS03Ni41MS0xNzYuNy0xNzAuNzgtMTc2Ljh6IG05My4xNyA1ODUuODFjLTAuMDYgNTMuMjYtNDEuNzQgOTYuNDEtOTMuMTggOTYuNDdoLTM5NS4xYy01MS40NC0wLjA2LTkzLjEyLTQzLjIxLTkzLjE5LTk2LjQ3di04NC4yNmgyMDEuMTdjOTQuMjctMC4xIDE3MC42Ni03OS4xOSAxNzAuNzgtMTc2Ljc5VjQ2OS4yM2MwLTIyLjE4LTE3LjM3LTQwLjE3LTM4LjgtNDAuMTctMjEuNDMgMC0zOC44IDE3Ljk5LTM4LjggNDAuMTd2MTE2LjkxYy0wLjA2IDUzLjI2LTQxLjc1IDk2LjQtOTMuMTggOTYuNDZIMTcwLjc4Yy01MS40NC0wLjA2LTkzLjEyLTQzLjItOTMuMTgtOTYuNDZWMTc3LjFjMC4wNi01My4yNiA0MS43NS05Ni40MiA5My4xOC05Ni40N2gzOTUuMTFjNTEuNDQgMC4wNSA5My4xMiA0My4yMSA5My4xOCA5Ni40N3Y4NC4yOEg0NTcuOTFjLTk0LjI3IDAuMS0xNzAuNjcgNzkuMTktMTcwLjc4IDE3Ni44djExNS4zOWMwIDIyLjE4IDE3LjM3IDQwLjE3IDM4LjggNDAuMTcgMjEuNDMgMCAzOC44LTE3Ljk5IDM4LjgtNDAuMTdWNDM4LjE4YzAuMDctNTMuMjUgNDEuNzUtOTYuNCA5My4xOS05Ni40NmgzOTUuMTFjNTEuNDMgMC4wNiA5My4xMSA0My4yMSA5My4xOCA5Ni40N3Y0MDkuMDMtMC4wM3ogbTAgMCIgcC1pZD0iNDU4NCI+PC9wYXRoPjwvc3ZnPg==",
        "auth":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY2MDUwNzM0NDUzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MjMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMi40OTg2ODggNTc0LjM0NzI2NGMtNjAuMjQ4MDY0IDAtMTE2LjY3ODY1Ni0yNy4yMzMyOC0xNTguODg1ODg4LTc2LjY3ODE0NC00MS4zMTQzMDQtNDguMzk3MzEyLTY0LjA2MTQ0LTExMi41MTUwNzItNjQuMDYxNDQtMTgwLjU0MzQ4OCAwLTY4LjAyODQxNiAyMi43NDcxMzYtMTMyLjE0NDEyOCA2NC4wNjE0NC0xODAuNTQyNDY0QzM5NS44MjAwMzIgODcuMTMxMTM2IDQ1Mi4yNDU1MDQgNTkuOTA0IDUxMi40OTg2ODggNTkuOTA0YzYwLjI1NjI1NiAwIDExNi42Nzk2OCAyNy4yMzMyOCAxNTguODg2OTEyIDc2LjY3MzAyNCA0MS4zMTQzMDQgNDguMzk4MzM2IDY0LjA2NzU4NCAxMTIuNTE5MTY4IDY0LjA2NzU4NCAxODAuNTQ3NTg0IDAgNjguMDI3MzkyLTIyLjc1NDMwNCAxMzIuMTQ1MTUyLTY0LjA2NzU4NCAxODAuNTQzNDg4QzYyOS4xNzkzOTIgNTQ3LjExMzk4NCA1NzIuNzU0OTQ0IDU3NC4zNDcyNjQgNTEyLjQ5ODY4OCA1NzQuMzQ3MjY0TDUxMi40OTg2ODggNTc0LjM0NzI2NHpNNTEyLjQ5ODY4OCAxMDYuMTU1MDA4Yy05Ny40Mjk1MDQgMC0xNzYuNzAyNDY0IDk0LjYzODA4LTE3Ni43MDI0NjQgMjEwLjk3MDYyNCAwIDExNi4zMzI1NDQgNzkuMjcyOTYgMjEwLjk3MTY0OCAxNzYuNzAyNDY0IDIxMC45NzE2NDggOTcuNDM1NjQ4IDAgMTc2LjcwMjQ2NC05NC42MzkxMDQgMTc2LjcwMjQ2NC0yMTAuOTcxNjQ4QzY4OS4yMDExNTIgMjAwLjc5MzA4OCA2MDkuOTM1MzYgMTA2LjE1NTAwOCA1MTIuNDk4Njg4IDEwNi4xNTUwMDhMNTEyLjQ5ODY4OCAxMDYuMTU1MDA4ek01MTIuNDk4Njg4IDEwNi4xNTUwMDgiIHAtaWQ9IjM1MjQiPjwvcGF0aD48cGF0aCBkPSJNMTE2LjQyNDcwNCA5NjQuNzI3ODA4Yy0wLjg5MjkyOC00Ljg5MzY5Ni0yMS4xMDM2MTYtMTIwLjk2NjE0NCA1OC43OTA5MTItMjE2Ljg4MzIgNjYuMzQxODg4LTc5LjYzNzUwNCAxNzkuODkzMjQ4LTEyMC4wMTk5NjggMzM3LjUwMzIzMi0xMjAuMDE5OTY4bDAgNDYuMjUzMDU2Yy03OC4xODk1NjggMC0xNDQuODExMDA4IDEwLjU5ODQtMTk4LjAwODgzMiAzMS41MDU0MDgtNDMuNDkzMzc2IDE3LjA5MDU2LTc4LjQ2NzA3MiA0MS4yNjcyLTEwMy45NTEzNiA3MS44Njk0NC02Ni4xODQxOTIgNzkuNDQ3MDQtNDkuMDIxOTUyIDE3Ny45MjgxOTItNDguODM4NjU2IDE3OC45MTczNzZMMTE2LjQyNDcwNCA5NjQuNzI3ODA4IDExNi40MjQ3MDQgOTY0LjcyNzgwOHpNMTE2LjQyNDcwNCA5NjQuNzI3ODA4IiBwLWlkPSIzNTI1Ij48L3BhdGg+PHBhdGggZD0iTTkwOC41NzM2OTYgOTY0LjcyNzgwOGwtNDUuNDg5MTUyLTguMzU4OTEyIDIyLjc0MjAxNiA0LjE3Njg5Ni0yMi43NTMyOC00LjExNjQ4YzAuMDQ0MDMyLTAuMjUyOTI4IDQuNDU4NDk2LTI1Ljc0ODQ4IDAuMzY3NjE2LTYwLjc3NDQtNS4zNTA0LTQ1Ljg2MzkzNi0yMi4wMzY0OC04NS43ODk2OTYtNDkuNTg5MjQ4LTExOC42NzQ0MzItMjUuNTI4MzItMzAuNDczMjE2LTYwLjUxNDMwNC01NC41NTE1NTItMTAzLjk3Nzk4NC03MS41NjQyODgtNTMuMTI1MTItMjAuNzk3NDQtMTE5LjYxMDM2OC0zMS4zMzk1Mi0xOTcuNTk3MTg0LTMxLjMzOTUyTDUxMi4yNzY0OCA2MjcuODI0NjRjMTU3LjYxMzA1NiAwIDI3MS4xNjQ0MTYgNDAuMzgzNDg4IDMzNy41MDUyOCAxMjAuMDE5OTY4QzkyOS42NzgzMzYgODQzLjc2MTY2NCA5MDkuNDczNzkyIDk1OS44MzQxMTIgOTA4LjU3MzY5NiA5NjQuNzI3ODA4TDkwOC41NzM2OTYgOTY0LjcyNzgwOHpNOTA4LjU3MzY5NiA5NjQuNzI3ODA4IiBwLWlkPSIzNTI2Ij48L3BhdGg+PC9zdmc+",
        "anchor":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY2MDUwNzEzMDM0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxOTciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTc1Ni4xMzUgNTEyYTggOCAwIDAgMS02LjM2Ny0xMi44NDNsOTEuODY0LTEyMC43ODVhOCA4IDAgMCAxIDEyLjczNiAwbDkxLjg2NCAxMjAuNzg1QTggOCAwIDAgMSA5MzkuODY1IDUxMkg4ODhjMCAyMDcuNjYtMTY4LjM0IDM3Ni0zNzYgMzc2LTIwNS41ODIgMC0zNzIuNjMtMTY0Ljk5LTM3NS45NS0zNjkuNzgyTDEzNiA1MTJIODIuMTM1YTggOCAwIDAgMS02LjM2Ny0xMi44NDNsOTEuODY0LTEyMC43ODVhOCA4IDAgMCAxIDEyLjczNiAwbDkxLjg2NCAxMjAuNzg1QTggOCAwIDAgMSAyNjUuODY1IDUxMkgyMTJjMCAxNTMuNTAxIDExNS4yODcgMjgwLjA3NiAyNjMuOTk4IDI5Ny44NjJsMC4wMDEtMzkwLjM5OUM0MTMuODkxIDQwMy40NzcgMzY4IDM0Ny4wOTggMzY4IDI4MGMwLTc5LjUyOSA2NC40NzEtMTQ0IDE0NC0xNDRzMTQ0IDY0LjQ3MSAxNDQgMTQ0YzAgNjcuMDk4LTQ1Ljg5IDEyMy40NzctMTA3Ljk5OCAxMzkuNDYzbDAuMDAxIDM5MC4zOTlDNjk1LjExIDc5Mi4yNjcgODA5LjUwNyA2NjguMjIgODExLjk2IDUxNi45Nkw4MTIgNTEyaC01NS44NjV6TTUxMiAyMTJjLTM3LjU1NSAwLTY4IDMwLjQ0NS02OCA2OHMzMC40NDUgNjggNjggNjggNjgtMzAuNDQ1IDY4LTY4LTMwLjQ0NS02OC02OC02OHoiIHAtaWQ9IjMxOTgiPjwvcGF0aD48L3N2Zz4=",
        "comment":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY0OTI3MDY1NzE4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxNjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTE1Ny41NjggNzUxLjI5NmMtMTEuMDA4LTE4LjY4OC0xOC4yMTg2NjctMzEuMjIxMzMzLTIxLjgwMjY2Ny0zNy45MDkzMzNBNDI0Ljg4NTMzMyA0MjQuODg1MzMzIDAgMCAxIDg1LjMzMzMzMyA1MTJDODUuMzMzMzMzIDI3Ni4zNjI2NjcgMjc2LjM2MjY2NyA4NS4zMzMzMzMgNTEyIDg1LjMzMzMzM3M0MjYuNjY2NjY3IDE5MS4wMjkzMzMgNDI2LjY2NjY2NyA0MjYuNjY2NjY3LTE5MS4wMjkzMzMgNDI2LjY2NjY2Ny00MjYuNjY2NjY3IDQyNi42NjY2NjdhNDI0Ljc3ODY2NyA0MjQuNzc4NjY3IDAgMCAxLTIxOS4xMjUzMzMtNjAuNTAxMzM0IDI3ODYuNTYgMjc4Ni41NiAwIDAgMC0yMC4wNTMzMzQtMTEuNzY1MzMzbC0xMDQuNDA1MzMzIDI4LjQ4Yy0yMy44OTMzMzMgNi41MDY2NjctNDUuODAyNjY3LTE1LjQxMzMzMy0zOS4yODUzMzMtMzkuMjk2bDI4LjQzNzMzMy0xMDQuMjg4eiBtNjUuMzAxMzMzIDMuNzg2NjY3bC0xNy4yNTg2NjYgNjMuMzA2NjY2IDYzLjMwNjY2Ni0xNy4yNTg2NjZhMzIgMzIgMCAwIDEgMjQuNTIyNjY3IDMuMjEwNjY2IDQ1MTUuODQgNDUxNS44NCAwIDAgMSAzMi4zNTIgMTguOTQ0QTM2MC43ODkzMzMgMzYwLjc4OTMzMyAwIDAgMCA1MTIgODc0LjY2NjY2N2MyMDAuMjk4NjY3IDAgMzYyLjY2NjY2Ny0xNjIuMzY4IDM2Mi42NjY2NjctMzYyLjY2NjY2N1M3MTIuMjk4NjY3IDE0OS4zMzMzMzMgNTEyIDE0OS4zMzMzMzMgMTQ5LjMzMzMzMyAzMTEuNzAxMzMzIDE0OS4zMzMzMzMgNTEyYzAgNjAuNTg2NjY3IDE0Ljg0OCAxMTguOTU0NjY3IDQyLjgyNjY2NyAxNzEuMTM2IDMuNzEyIDYuOTEyIDEyLjkyOCAyMi44MjY2NjcgMjcuMzcwNjY3IDQ3LjIzMmEzMiAzMiAwIDAgMSAzLjMzODY2NiAyNC43MTQ2Njd6IG0xNDUuOTk0NjY3LTcwLjc3MzMzNGEzMiAzMiAwIDEgMSA0MC45MTczMzMtNDkuMjA1MzMzQTE1OS4xODkzMzMgMTU5LjE4OTMzMyAwIDAgMCA1MTIgNjcyYzM3Ljg4OCAwIDczLjY3NDY2Ny0xMy4xNzMzMzMgMTAyLjE4NjY2Ny0zNi44ODUzMzNhMzIgMzIgMCAwIDEgNDAuOTE3MzMzIDQ5LjIxNkEyMjMuMTc4NjY3IDIyMy4xNzg2NjcgMCAwIDEgNTEyIDczNmEyMjMuMTc4NjY3IDIyMy4xNzg2NjcgMCAwIDEtMTQzLjEzNi01MS42OTA2Njd6IiBwLWlkPSIyMTY3Ij48L3BhdGg+PC9zdmc+",
        "write":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY0OTI3MTMzNzUxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzMDUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTg2Mi43MDkzMzMgMTE2LjA0MjY2N2EzMiAzMiAwIDEgMSA0NS4yNDggNDUuMjQ4TDQ1NS40NDUzMzMgNjEzLjgxMzMzM2EzMiAzMiAwIDEgMS00NS4yNTg2NjYtNDUuMjU4NjY2TDg2Mi43MDkzMzMgMTE2LjA1MzMzM3pNODUzLjMzMzMzMyA0NDhhMzIgMzIgMCAwIDEgNjQgMHYzNTJjMCA2NC44LTUyLjUzMzMzMyAxMTcuMzMzMzMzLTExNy4zMzMzMzMgMTE3LjMzMzMzM0gyMjRjLTY0LjggMC0xMTcuMzMzMzMzLTUyLjUzMzMzMy0xMTcuMzMzMzMzLTExNy4zMzMzMzNWMjI0YzAtNjQuOCA1Mi41MzMzMzMtMTE3LjMzMzMzMyAxMTcuMzMzMzMzLTExNy4zMzMzMzNoMzQxLjMzMzMzM2EzMiAzMiAwIDAgMSAwIDY0SDIyNGE1My4zMzMzMzMgNTMuMzMzMzMzIDAgMCAwLTUzLjMzMzMzMyA1My4zMzMzMzN2NTc2YTUzLjMzMzMzMyA1My4zMzMzMzMgMCAwIDAgNTMuMzMzMzMzIDUzLjMzMzMzM2g1NzZhNTMuMzMzMzMzIDUzLjMzMzMzMyAwIDAgMCA1My4zMzMzMzMtNTMuMzMzMzMzVjQ0OHoiIHAtaWQ9IjIzMDYiPjwvcGF0aD48L3N2Zz4=",
    };
    App.cache.setG("icons",icons);
    
    var his=[];
    var RPC = App.cache.getG("RPC");
    var self = {
        listening: function () {
            var name = App.cache.getG("name");
            RPC.common.subscribe(function (list) {
                if (list.length == 0) return false;
                for (var i = 0; i < list.length; i++) {
                    var row = list[i];
                    if(!row.data) continue;
                    var data=row.data;
                    if (data.protocol && data.protocol.type === "data" && data.protocol.app === name) {
                        self.pushHistory(row);
                        self.decode(row);
                        self.bind();
                        App.fresh();
                    }
                }
            });
        },
        showHistory:function(){
            var decode=self.decode;
            if(his.length===0){
                self.getLatest(config.cache,function(list){
                    for(var i=0;i<list.length;i++){
                        if(list[i].empty) continue;
                        his.push(list[i]);
                    }
                    for(var i=0;i<his.length;i++) decode(his[i]);
                    self.bind();
                    App.fresh();
                });
            }else{
                for(var i=0;i<his.length;i++)decode(his[i]);
                self.bind();
                App.fresh();
            }
        },
        
        getLatest:function(anchor,ck){
            RPC.common.search(anchor,function(res){
                if(res.owner===null) return ck && ck([]);
                if(!res.data || !res.data.raw || !res.data.raw.recommend)return ck && ck([]);
                var ans=res.data.raw.recommend;
                RPC.common.multi(ans,function(list){
                    ck && ck(list);
                });
            });
        },
        pushHistory:function(row){
            if(his.length>=config.max){
                his.shift();
                return this.pushHistory(row);
            }
            his.push(row);
        },
        decode: function (row) {
            var viewer=self.getRow(row);
            var opt=self.getOperation(row);
            var dom = `<div class="row">
                ${viewer}${opt}
                <div class="col-12"><hr /></div>
            </div>`;
            
            $("#" + config.cls.entry).prepend(dom);
        },
        getRow:function(row){
            var ctx = row.data.raw, cls = config.cls;
            var dt = { anchor: row.name, block: row.block, owner: row.owner };
            var igs=ctx.imgs && ctx.imgs.length>0?self.getImages(ctx.imgs):'';
            var ss="opacity:0.7;";
            return `<div class="col-12 pt-2 ${cls.row}" >
                <span page="view" data='${JSON.stringify(dt)}'><h5>${ctx.title}</h5></span>
            </div>
            <div class="col-4 ${cls.account}">${App.tools.shorten(row.owner, 8)}</div>
            <div class="col-8 ${cls.block} text-end">
            <img style="widht:10px;height:10px;margin:-2px 6px 0px 0px;${ss}" src="${icons.block}"><strong>${row.block}</strong> , 
            <img style="widht:12px;height:12px;margin:-2px 0px 0px 0px;${ss}" src="${icons.anchor}">
                <span page="history" data='${JSON.stringify({ anchor: row.name })}'><strong>${row.name}</strong></span></strong> 
            </div>
            <div class="col-12 gy-2 ${cls.row}">
                <span page="view" data='${JSON.stringify(dt)}'>${!ctx.desc ? "" : ctx.desc}</span>
            </div>${igs}
            `;
        },
        getImages:function(imgs){
            var len=imgs.length,num = 12/len;
            var dom='';
            for(var i=0;i<len;i++){
                var img=imgs[i];
                dom+=`<div class="col-${num}">
                    <p style="height:${300/len}px;background-image:url(${img});background-size: cover;"></p>
                </div>`;
            }
            return dom;
        },
        getOperation:function(row){
            var ctx = row.data.raw, cls = config.cls;
            var cmt= { anchor: row.name, block: row.block, owner: row.owner,title:ctx.title };
            var dt=JSON.stringify(cmt);
            var num=123;
            return `<div class="col-12 text-end gy-2 ${cls.operation}">
                <span page="comment" data='${dt}'>
                    <img style="widht:21px;height:21px;" src="${icons.comment}">
                </span>
                <span>${num}</span>
            </div>`;
            //return `<div class="col-3 gy-2 ${cls.operation}"><span page="share" data='${dt}'>Share</span></div>
            //<div class="col-3 gy-2 ${cls.operation}"><span page="comment" data='${dt}'>Comment</span></div>
            //<div class="col-3 gy-2 ${cls.operation} ${cls.thumbs}"><p data='${dt}'>Good</p></div>
            //<div class="col-3 gy-2 ${cls.operation} ${cls.fav}"><p data='${dt}'>Fav</p></div>`;
        },
        bind:function(){
            var cls=config.cls;
            $("#"+cls.entry).find('.'+cls.thumbs).off('click').on('click',function(){
                console.log('thumbs up by ');       //实名点赞
            });

            $("#"+cls.entry).find('.'+cls.fav).off('click').on('click',function(){
                console.log('fav');
            });
        },
        //prepare the basic data when code loaded
        struct: function () {
            var pre=config.prefix;  
            var hash = App.tools.hash;
            for (var k in config.cls) {
                if (!config.cls[k]) config.cls[k] = pre + hash();
            }

            page.data.preload=self.template();

            return true;       
        },
        template:function(){
            var css=self.getCSS();
            var add=self.getAdd();
            return `${css}<div id="${config.cls.entry}">${add}</div>`;
        },
        getCSS:function(){
            var cls=config.cls;
            var cmap = `<style>
                #${cls.entry} hr{color:#CCCCCC}
                .${cls.account}{font-size:10px;color:#EF8889;}
                .${cls.block}{font-size:10px;}
                .${cls.operation}{font-size:10px;}
                #${cls.entry} .${cls.add}{width:100px;height:48px;background:#F4F4F4;opacity: 0.9;position:fixed;right:20px;bottom:25%;border-radius:24px;border:1px solid #AAAAAA;line-height:48px;text-align: center;box-shadow: 3px 3px 3px #BBBBBB;}
                #${cls.entry} .${cls.add} img{opacity: 0.8;}   
            </style>`;
            return cmap;
        },
        getAdd:function(){
            var cls=config.cls;
            return `<div class="${cls.add}">
                <span page="write" data="{}">
                <img style="width:36px;height:36px;margin-bottom:5px;margin-left:5px;opacity: 0.4;" src="${icons.write}"></span>
            </div>`;
        },
    };

    var page = {
        "data": {
            "name": config.name,
            "title": "freeSaying",
            "params": {},
            "preload": "",
            "snap": "",
        },
        "events": {
            "before": function (params, ck) {
                var result={code:1,message:"successful"};
                ck && ck(result);
            },
            "loading": function (params, ck) {
                self.showHistory();
                self.listening();
                ck && ck();
            },
            "after": function (params, ck) {
                ck && ck();
            },
        },
    };
    self.struct();          //set component enviment
    App.page(config.name, page);
})(cMedia);