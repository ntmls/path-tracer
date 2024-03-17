import { RgbColor } from "./RgbColor";

/**
  - Candlelight: 1800K - 2000K
  - Tungsten bulb: 2800K - 3200K
  - Sunrise/sunset: 2500K - 3500K
  - Midday sunlight: 5500K - 6000K
  - Overcast daylight: 6000K - 7000K
 */
export class Kelvin {
  static readonly k1000 = new RgbColor(255, 56, 0).scale(1 / 255);
  static readonly k1100 = new RgbColor(255, 71, 0).scale(1 / 255);
  static readonly k1200 = new RgbColor(255, 83, 0).scale(1 / 255);
  static readonly k1300 = new RgbColor(255, 93, 0).scale(1 / 255);
  static readonly k1400 = new RgbColor(255, 101, 0).scale(1 / 255);
  static readonly k1500 = new RgbColor(255, 109, 0).scale(1 / 255);
  static readonly k1600 = new RgbColor(255, 115, 0).scale(1 / 255);
  static readonly k1700 = new RgbColor(255, 121, 0).scale(1 / 255);
  static readonly k1800 = new RgbColor(255, 126, 0).scale(1 / 255);
  static readonly k1900 = new RgbColor(255, 131, 0).scale(1 / 255);
  static readonly k2000 = new RgbColor(255, 138, 18).scale(1 / 255);
  static readonly k2100 = new RgbColor(255, 142, 33).scale(1 / 255);
  static readonly k2200 = new RgbColor(255, 147, 44).scale(1 / 255);
  static readonly k2300 = new RgbColor(255, 152, 54).scale(1 / 255);
  static readonly k2400 = new RgbColor(255, 157, 63).scale(1 / 255);
  static readonly k2500 = new RgbColor(255, 161, 72).scale(1 / 255);
  static readonly k2600 = new RgbColor(255, 165, 79).scale(1 / 255);
  static readonly k2700 = new RgbColor(255, 169, 87).scale(1 / 255);
  static readonly k2800 = new RgbColor(255, 173, 94).scale(1 / 255);
  static readonly k2900 = new RgbColor(255, 177, 101).scale(1 / 255);
  static readonly k3000 = new RgbColor(255, 180, 107).scale(1 / 255);
  static readonly k3100 = new RgbColor(255, 184, 114).scale(1 / 255);
  static readonly k3200 = new RgbColor(255, 187, 120).scale(1 / 255);
  static readonly k3300 = new RgbColor(255, 190, 126).scale(1 / 255);
  static readonly k3400 = new RgbColor(255, 193, 132).scale(1 / 255);
  static readonly k3500 = new RgbColor(255, 196, 137).scale(1 / 255);
  static readonly k3600 = new RgbColor(255, 199, 143).scale(1 / 255);
  static readonly k3700 = new RgbColor(255, 201, 148).scale(1 / 255);
  static readonly k3800 = new RgbColor(255, 204, 153).scale(1 / 255);
  static readonly k3900 = new RgbColor(255, 206, 159).scale(1 / 255);
  static readonly k4000 = new RgbColor(255, 209, 163).scale(1 / 255);
  static readonly k4100 = new RgbColor(255, 211, 168).scale(1 / 255);
  static readonly k4200 = new RgbColor(255, 213, 173).scale(1 / 255);
  static readonly k4300 = new RgbColor(255, 215, 177).scale(1 / 255);
  static readonly k4400 = new RgbColor(255, 217, 182).scale(1 / 255);
  static readonly k4500 = new RgbColor(255, 219, 186).scale(1 / 255);
  static readonly k4600 = new RgbColor(255, 221, 190).scale(1 / 255);
  static readonly k4700 = new RgbColor(255, 223, 194).scale(1 / 255);
  static readonly k4800 = new RgbColor(255, 225, 198).scale(1 / 255);
  static readonly k4900 = new RgbColor(255, 227, 202).scale(1 / 255);
  static readonly k5000 = new RgbColor(255, 228, 206).scale(1 / 255);
  static readonly k5100 = new RgbColor(255, 230, 210).scale(1 / 255);
  static readonly k5200 = new RgbColor(255, 232, 213).scale(1 / 255);
  static readonly k5300 = new RgbColor(255, 233, 217).scale(1 / 255);
  static readonly k5400 = new RgbColor(255, 235, 220).scale(1 / 255);
  static readonly k5500 = new RgbColor(255, 236, 224).scale(1 / 255);
  static readonly k5600 = new RgbColor(255, 238, 227).scale(1 / 255);
  static readonly k5700 = new RgbColor(255, 239, 230).scale(1 / 255);
  static readonly k5800 = new RgbColor(255, 240, 233).scale(1 / 255);
  static readonly k5900 = new RgbColor(255, 242, 236).scale(1 / 255);
  static readonly k6000 = new RgbColor(255, 243, 239).scale(1 / 255);
  static readonly k6100 = new RgbColor(255, 244, 242).scale(1 / 255);
  static readonly k6200 = new RgbColor(255, 245, 245).scale(1 / 255);
  static readonly k6300 = new RgbColor(255, 246, 247).scale(1 / 255);
  static readonly k6400 = new RgbColor(255, 248, 251).scale(1 / 255);
  static readonly k6500 = new RgbColor(255, 249, 253).scale(1 / 255);
  static readonly k6600 = new RgbColor(254, 249, 255).scale(1 / 255);
  static readonly k6700 = new RgbColor(252, 247, 255).scale(1 / 255);
  static readonly k6800 = new RgbColor(249, 246, 255).scale(1 / 255);
  static readonly k6900 = new RgbColor(247, 245, 255).scale(1 / 255);
  static readonly k7000 = new RgbColor(245, 243, 255).scale(1 / 255);
  static readonly k7100 = new RgbColor(243, 242, 255).scale(1 / 255);
  static readonly k7200 = new RgbColor(240, 241, 255).scale(1 / 255);
  static readonly k7300 = new RgbColor(239, 240, 255).scale(1 / 255);
  static readonly k7400 = new RgbColor(237, 239, 255).scale(1 / 255);
  static readonly k7500 = new RgbColor(235, 238, 255).scale(1 / 255);
  static readonly k7600 = new RgbColor(233, 237, 255).scale(1 / 255);
  static readonly k7700 = new RgbColor(231, 236, 255).scale(1 / 255);
  static readonly k7800 = new RgbColor(230, 235, 255).scale(1 / 255);
  static readonly k7900 = new RgbColor(228, 234, 255).scale(1 / 255);
  static readonly k8000 = new RgbColor(227, 233, 255).scale(1 / 255);
  static readonly k8100 = new RgbColor(225, 232, 255).scale(1 / 255);
  static readonly k8200 = new RgbColor(224, 231, 255).scale(1 / 255);
  static readonly k8300 = new RgbColor(222, 230, 255).scale(1 / 255);
  static readonly k8400 = new RgbColor(221, 230, 255).scale(1 / 255);
  static readonly k8500 = new RgbColor(220, 229, 255).scale(1 / 255);
  static readonly k8600 = new RgbColor(218, 229, 255).scale(1 / 255);
  static readonly k8700 = new RgbColor(217, 227, 255).scale(1 / 255);
  static readonly k8800 = new RgbColor(216, 227, 255).scale(1 / 255);
  static readonly k8900 = new RgbColor(215, 226, 255).scale(1 / 255);
  static readonly k9000 = new RgbColor(214, 225, 255).scale(1 / 255);
  static readonly k9100 = new RgbColor(212, 225, 255).scale(1 / 255);
  static readonly k9200 = new RgbColor(211, 224, 255).scale(1 / 255);
  static readonly k9300 = new RgbColor(210, 223, 255).scale(1 / 255);
  static readonly k9400 = new RgbColor(209, 223, 255).scale(1 / 255);
  static readonly k9500 = new RgbColor(208, 222, 255).scale(1 / 255);
  static readonly k9600 = new RgbColor(207, 221, 255).scale(1 / 255);
  static readonly k9700 = new RgbColor(207, 221, 255).scale(1 / 255);
  static readonly k9800 = new RgbColor(206, 220, 255).scale(1 / 255);
  static readonly k9900 = new RgbColor(205, 220, 255).scale(1 / 255);
  static readonly k10000 = new RgbColor(207, 218, 255).scale(1 / 255);
  static readonly k10100 = new RgbColor(207, 218, 255).scale(1 / 255);
  static readonly k10200 = new RgbColor(206, 217, 255).scale(1 / 255);
  static readonly k10300 = new RgbColor(205, 217, 255).scale(1 / 255);
  static readonly k10400 = new RgbColor(204, 216, 255).scale(1 / 255);
  static readonly k10500 = new RgbColor(204, 216, 255).scale(1 / 255);
  static readonly k10600 = new RgbColor(203, 215, 255).scale(1 / 255);
  static readonly k10700 = new RgbColor(202, 215, 255).scale(1 / 255);
  static readonly k10800 = new RgbColor(202, 214, 255).scale(1 / 255);
  static readonly k10900 = new RgbColor(201, 214, 255).scale(1 / 255);
  static readonly k11000 = new RgbColor(200, 213, 255).scale(1 / 255);
  static readonly k11100 = new RgbColor(200, 213, 255).scale(1 / 255);
  static readonly k11200 = new RgbColor(199, 212, 255).scale(1 / 255);
  static readonly k11300 = new RgbColor(198, 212, 255).scale(1 / 255);
  static readonly k11400 = new RgbColor(198, 212, 255).scale(1 / 255);
  static readonly k11500 = new RgbColor(197, 211, 255).scale(1 / 255);
  static readonly k11600 = new RgbColor(197, 211, 255).scale(1 / 255);
  static readonly k11700 = new RgbColor(197, 210, 255).scale(1 / 255);
  static readonly k11800 = new RgbColor(196, 210, 255).scale(1 / 255);
  static readonly k11900 = new RgbColor(195, 210, 255).scale(1 / 255);
  static readonly k12000 = new RgbColor(195, 209, 255).scale(1 / 255);
}