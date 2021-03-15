"use strict";
/*
2020/03/16 の改訂項目
getFb(), getMa() にある引数m21(M2/M1)のデフォルト値0を2に変更
(M2/M1の値は0でも有効な値になるため)
*/
// H形鋼の計算
class steelH {
    // プロパティ: H形鋼の寸法 (mm)
    // h: せい, b: 幅,  tw: ウェブ厚, tf: フランジ厚, r: ウェブ端部のアール
	constructor(h = 0, b = 0, tw = 0, tf = 0, r = 0) {
		this.h = h;
		this.b = b;
		this.tw = tw;
		this.tf = tf;
		this.r = r;
    }
    validSize() {
        // 寸法のチェック
        // 戻り値 false: 寸法に誤りがある, true: 正常
        if ((this.h < 10.0) || (this.b < 10.0) || (this.tw < 0.1) || (this.tf < 0.1) || (this.r < -0.1)) {
            return false;
        } else if ((this.h - 2.0 * this.tf) < 0.1) {
            // ウェブのせいが確保できない
            return false;
        } else if ((this.b - this.tw) < 0.1) {
            // フランジの幅が確保できない
            return false;
        } else {
            return true;
        }
    }
    get Area() {
        // 戻り値: 断面積 (cm2)
        if (this.validSize) {
            // mm -> cm 
            let h = 0.1 * this.h;
            let b = 0.1 * this.b;
            let tw = 0.1 * this.tw;
            let tf = 0.1 * this.tf;
            let r1 = 0.1 * this.r;
            let h1 = h - 2.0 * tf;
            return b * tf * 2.0 + h1 * tw + 0.8584 * r1 * r1;
        } else {
            return 0;
        }
    }
    get Ix() {
        // 戻り値: 強軸回りの断面2次モーメント (cm4)
        if (this.validSize) {
            // mm -> cm 
            let h = 0.1 * this.h;
            let b = 0.1 * this.b;
            let tw = 0.1 * this.tw;
            let tf = 0.1 * this.tf;
            let r1 = 0.1 * this.r;
            let h1 = h - 2.0 * tf;
            let h2 = 0.5 * h - tf - 0.2234 * r1;
            return b * h * h * h / 12.0 - (b - tw) * h1 * h1 * h1 / 12.0 + 0.8584 * r1 * r1 * h2 * h2;
        } else {
            return 0;
        }
    }
    get Iy() {
        // 戻り値: 弱軸回りの断面2次モーメント (cm4)
        if (this.validSize) {
            // mm -> cm 
            let h = 0.1 * this.h;
            let b = 0.1 * this.b;
            let tw = 0.1 * this.tw;
            let tf = 0.1 * this.tf;
            let r1 = 0.1 * this.r;
            let h1 = h - 2.0 * tf;
            let h2 = 0.2234 * r1 + 0.5 * tw;
            return tf * b * b * b / 6.0 + h1 * tw * tw * tw / 12.0 + 0.8584 * r1 * r1 * h2 * h2;
        } else {
            return 0;
        }
    }
    get Zx() {
        // 戻り値: 強軸回りの断面係数 (cm3)
        if (this.validSize) {
            return this.Ix / (0.1 * (this.h / 2.0));
        } else {
            return 0;
        }
    }
    get Zy() {
        // 戻り値: 弱軸回りの断面係数 (cm3)
        if (this.validSize) {
            return this.Iy / (0.1 * (this.b / 2.0));
        } else {
            return 0;
        }
    }
    get Jw() {
        // 戻り値: サンブナンの捩り定数 (cm4)
        if (this.validSize) {
            // mm -> cm 
            let b = 0.1 * this.b;
            let tw = 0.1 * this.tw;
            let tf = 0.1 * this.tf;
            let h1 = 0.1 * this.h - tf;
            return (2.0 * b * tf * tf * tf + h1 * tw * tw * tw) / 3.0;
        } else {
            return 0;
        }
    }
    get Iw() {
        // 戻り値: 曲げ捩り定数 (cm6)
        if (this.validSize) {
            let h1 = 0.1 * (this.h - this.tf);
            return this.Iy * h1 * h1 / 4.0;
        } else {
            return 0;
        }
    }
    getFc(lkx = 0.0, lky = 0.0, f = 235) {
        // 長期許容圧縮応力度の計算
        // lkx: 強軸回りの座屈長さ (m), lky: 弱軸回りの座屈長さ (m), f: F値 (N/mm2)
        // 戻り値: 長期許容圧縮応力度 (N/mm2)
        if ((!this.validSize) || (f < 0.1)) {
            return 0;
        } else if (lkx < 0.1) {
            // 座屈を考慮しない
            return f / 1.5;
        } else if (lky < 0.1) {
            // lky が省略された場合は lky = lkx
            lky = lkx;
        }
        let lamda = Math.sqrt(2023265.5 / (0.6 * f)); // 限界細長比 Λ (E = 205000)
        let ix = Math.sqrt(this.Ix / this.Area); // 強軸回り断面2次半径
        let iy = Math.sqrt(this.Iy / this.Area); // 弱軸回り断面2次半径
        let lamda1 = 100.0 * lkx / ix; // 細長比 λ
        if ((lky / iy) > (lkx / ix)) {
            lamda1 = 100.0 * lky / iy;            
        }
        let lamda2 = Math.pow(lamda1 / lamda, 2); // (λ / Λ) ^ 2
        if (lamda1 < lamda) {
            // λ < Λ
            return f * (1.0 - 0.4 * lamda2) / (1.5 + 0.667 * lamda2);
        } else {
            // λ > Λ
            return 0.277 * f / lamda2;
        }
    }
    getNa(lkx = 0.0, lky = 0.0, f = 235) {
        // 長期軸耐力の計算
        // lkx: 強軸回りの座屈長さ (m), lky: 弱軸回りの座屈長さ (m), f: F値 (N/mm2)
        // 戻り値: 長期軸耐力 (kN)
        return 0.1 * this.Area * this.getFc(lkx, lky, f); // N -> kN
    }
    getFb(lb = 0.0, m21 = 2.0, f = 235) {
        // 長期曲げ応力度の計算
        // lb: 圧縮フランジの支点間距離 (m), f: F値 (N/mm2)
        // m21: 補正係数Cの算定時のM2/M1の値 (正負符号に注意. 省略時はCを1.0とする) 
        // 戻り値: 長期曲げ圧縮応力度 (N/mm2)
        if ((!this.validSize) || (f < 0.1)) {
            return 0;
        } else if (lb < 0.1) {
            // 横座屈を考慮しない
            return f / 1.5;
        }
        let prb = 0.3; // pλb
        let c = 1.0; // 補正係数C
        if (Math.abs(m21) < 1.0) {
            prb = 0.6 + 0.3 * m21;
            c = 1.75 + 1.05 * m21 + 0.3 * m21 * m21;
            if (c < 1.0) {
                c = 1.0;
            } else if (c > 2.3) {
                c = 2.3;
            }
        }
        let me; // 横座屈モーメント (N.cm)
        const E = 20500000; // ヤング係数 (N/cm2)
        const G = 7900000; // せん断弾性係数 (N/cm2)
        me = Math.pow(Math.PI / (100.0 * lb), 4) * E * this.Iy * E * this.Iw;
        me = me + Math.pow(Math.PI / (100.0 * lb), 2) * E * this.Iy * G * this.Jw;
        me = c * Math.sqrt(me);
        let rb = Math.sqrt(100.0 * f * this.Zx / me); // λb
        const erb = 1.291; // eλb 
        let nu = 1.5 + 0.667 * Math.pow((rb / erb), 2); // ν
        if (rb < prb) {
            // λb < pλb
            return f / nu;            
        } else if (rb < erb) {
            // pλb < λb < eλb
            return (f / nu) * (1.0 - 0.4 * (rb - prb) / (erb - prb));
        }  else {
            // eλb < λb
            return f / (rb * rb * 2.17);
        }
    }
    getMa(lb = 0.0, m21 = 2.0, f = 235) {
        // 長期曲げ耐力の計算
        // lb: 圧縮フランジの支点間距離 (m), f: F値 (N/mm2)
        // m21: 補正係数Cの算定時のM2/M1の値 (正負符号に注意. 省略時はCを1.0とする) 
        // 戻り値: 長期曲げ耐力 (kN.m)
        return 0.001 * this.Zx * this.getFb(lb, m21, f); // N.cm -> kN.m
    }
}