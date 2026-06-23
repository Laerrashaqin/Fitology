import { ShapeData } from "../../../types";

export const recommendationsData: Record<
  string,
  Record<string, Record<string, ShapeData>>
> = {
  id: {
    women: {
      Hourglass: {
        title: "Jam Pasir (Hourglass)",
        introText:
          "Maksimalkan proporsi utamamu. Aturan emas untuk siluet Jam Pasir.",
        desc: "Proporsi tubuh bagian atas dan bawah sudah sangat seimbang dengan lekuk pinggang yang tegas dan jelas.",
        tipsList: [
          "Jadikan garis pinggang alami sebagai titik fokus utama dari siluet pakaianmu.",
          "Hindari potongan pakaian oversized atau boxy yang menenggelamkan bentuk asli tubuh.",
          "Gunakan material pakaian yang jatuh mengikuti bentuk badan (flowy/draped).",
        ],
        fits: [
          {
            name: "Wrap Top / Blouse",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menegaskan garis pinggang dan secara natural mengikuti lekuk alami.",
            img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "High-Waist Trousers",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Mengunci proporsi di area terkecil pinggang dan memberi efek kaki lebih jenjang.",
            img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "V-Neck Midi Dress",
            cat: "Terusan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menyeimbangkan proporsi atas dan bawah dengan siluet klasik yang tajam.",
            img: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Pear: {
        title: "Segitiga (Pear)",
        introText:
          "Seimbangkan siluet bawah. Aturan emas untuk tipe tubuh Segitiga bawah.",
        desc: "Area pinggul dan paha kamu lebih lebar dibandingkan bahu, memberikan siluet kokoh di bagian bawah.",
        tipsList: [
          "Tambahkan detail struktural di area bahu atau dada untuk menyeimbangkan proporsi.",
          "Implementasikan warna terang untuk atasan dan palet gelap untuk bawahan.",
          "Pilih celana berpotongan lurus (straight-leg) atau rok A-line untuk menutrisi siluet pinggul.",
        ],
        fits: [
          {
            name: "Puff Sleeve Top",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menambahkan volume ekstra di area pundak agar seimbang dengan pinggul.",
            img: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Dark Wash Straight",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Pemilihan warna gelap dan potongan lurus memberi ilusi ramping secara vertikal.",
            img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Off-Shoulder Dress",
            cat: "Terusan",
            reasonTag: "The Fit",
            reasonDesc:
              "Mengekspos tulang selangka untuk menarik fokus pandangan ke bagian atas.",
            img: "https://images.unsplash.com/photo-1566206091558-f6268976b39c?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      "Inverted Triangle": {
        title: "Segitiga Terbalik (Inverted)",
        introText:
          "Atur keseimbangan atas. Aturan emas untuk tipe tubuh Segitiga Terbalik.",
        desc: "Bahu dan lingkar dadamu lebih bidang dibandingkan area pinggul dan tubuh bagian bawah secara keseluruhan.",
        tipsList: [
          "Titikberatkan detail volume pada pakaian bagian bawah untuk menyeimbangkan garis bahu.",
          "Gunakan kerah V (V-neck) atau kerah dalam untuk memecah area dada yang bidang.",
          "Celana pallazo, kulot wide-leg, atau rok A-line adalah fondasi terbaik.",
        ],
        fits: [
          {
            name: "Deep V-Neck Top",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Memecah area bidang pada dada dan memberikan ilusi leher lebih jenjang.",
            img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Wide-Leg Palazzo",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menambahkan dimensi volume di bagian bawah untuk proporsi yang presisi.",
            img: "https://images.unsplash.com/photo-1624378514125-9a8b139ce844?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Pleated A-Line Dress",
            cat: "Terusan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menciptakan lekukan arsitektural dan volume struktural di area pinggul.",
            img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Rectangle: {
        title: "Atletis (Rectangle)",
        introText:
          "Ciptakan siluet baru. Aturan emas untuk tipe tubuh Atletis (Rectangle).",
        desc: "Proporsi garis tepi dada, pinggang, dan pinggul nyaris sama, menciptakan siluet linier yang sporty.",
        tipsList: [
          "Ciptakan pemisah pinggang buatan dengan sabuk, ikat pinggang, atau teknik color-blocking.",
          "Atasan dengan tekstur ruffle, layer, atau potongan peplum menambah dimensi.",
          "Celana flared atau bootcut bisa memberikan volume ekstra sehingga memecah garis lurus kaki.",
        ],
        fits: [
          {
            name: "Peplum Top",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Secara struktural menciptakan garis pinggang buatan dengan volume tambahan di bawah.",
            img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Flared Denim",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Membentuk profil jam pasir pada siluet kaki yang semulanya sepenuhnya lurus.",
            img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Wrap Dress with Belt",
            cat: "Terusan",
            reasonTag: "The Fit",
            reasonDesc:
              "Desain silang asimetris dipadukan dengan sabuk otomatis memahat garis pinggang.",
            img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
    },
    men: {
      Trapezoid: {
        title: "Trapesium (Trapezoid)",
        introText:
          "Standar estetika pria. Siluet ideal yang memudahkan variasi wardrobe.",
        desc: "Lebar bahu dan dada proporsional, mengecil perlahan secara konstan hingga area pinggang. Harmoni sempurna.",
        tipsList: [
          "Gunakan kemeja dengan potongan slim fit atau tailored fit untuk menonjolkan arsitektur dada.",
          "Hampir seluruh jenis celana rasional untuk dicoba, namun straight-leg memberi aksen terbersih.",
          "Hindari penggunaan pakaian baggy tanpa struktur jika Anda ingin mempertahankan estetika siluet.",
        ],
        fits: [
          {
            name: "Tailored Slim Shirt",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menonjolkan garis bahu yang maskulin tanpa terlihat terlalu memaksakan diri.",
            img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Slim-Straight Jeans",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Keseimbangan vertikal ideal antara lebar pinggang dan panjang kaki.",
            img: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Structured Blazer",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "Konstruksi jas mengikuti V-taper natural dari torso, menyempurnakan bentuk bahu.",
            img: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      "Inverted Triangle": {
        title: "V-Taper Ekstrem (Inverted)",
        introText:
          "Kendalikan impresi area atas tubuh. Strategi untuk bahu super bidang.",
        desc: "Bahu dan dada sangat mendominasi struktur keseluruhan, dengan rasio pengecilan ekstrim di area pinggang.",
        tipsList: [
          "Eksploitasi atasan kerah V (V-neck) untuk memutus intensitas area dada yang terlampau dominan.",
          "Gunakan celana dengan profil straight-leg atau sedikit longgar (relaxed) untuk menyeimbangkan massa tubuh atas.",
          "Hindari jaket dengan padding ekstra di bahu (shoulder pads) karena akan mendistorsi siluet.",
        ],
        fits: [
          {
            name: "V-Neck Basic Tee",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Mengarahkan pandangan secara vertikal, membuat kerangka terlihat lebih luwes.",
            img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Relaxed Fit Chinos",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menyediakan tambahan volume parsial di area kaki bawah agar keseluruhan tertata.",
            img: "https://images.unsplash.com/photo-1624378514125-9a8b139ce844?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Unstructured Jacket",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "Meniadakan bantalan bahu agar struktur dada ekstrim menjadi lebih rileks.",
            img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Rectangle: {
        title: "Linear (Rectangle)",
        introText:
          "Eksperimen lapisan (layering). Strategi krusial untuk siluet vertikal lurus.",
        desc: "Ukuran linimasa bahu, dada, dan pinggang relatif seragam, sering ditemukan pada morfologi ektomorf.",
        tipsList: [
          "Implementasikan sistem layering lapis ganda (kaos dipadukan dengan kemeja kancing terbuka) untuk membangun ruang ilusi dada.",
          "Pilih elemen grafis horizontal untuk menarik ilusi pelebaran di area torso atas.",
          "Profil celana slim fit dan lurus wajib dipertahankan untuk menjamin integritas siluet pria rapi.",
        ],
        fits: [
          {
            name: "Horizontal Stripe Tee",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Garis horizontal memperlebar kerangka optik, mendistorsi pandangan sempit.",
            img: "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Classic Chinos",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Formasi rapi standar yang tidak mengekspos bentuk kaki yang terlampau lurus kurus.",
            img: "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Denim / Trucker Jacket",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "Materi padat (kaku) dari denim menyumbang garis artifisial dada maskulin.",
            img: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Triangle: {
        title: "Segitiga (Triangle)",
        introText: "Teknik framing siluet. Fokuskan pergeseran titik berat.",
        desc: "Konstruksi wilayah perut atau pinggang lebih menonjol melebihi ukuran bidang bahu dan tulang selangka.",
        tipsList: [
          "Prinsip penggelapan spasial: aplikasikan palet warna redup (navy, charcoal) pada bagian atas agar area pusat tersamarkan.",
          "Utamakan jaket dan blazer terstruktur (padded shoulders) untuk mereproduksi keseimbangan atas secara instan.",
          "Jangan pakai pola pakaian mencolok terpusat pada area perut dan pastikan setelan berprofil klasikal, bukan ketat.",
        ],
        fits: [
          {
            name: "Dark Regular Polo",
            cat: "Atasan",
            reasonTag: "The Fit",
            reasonDesc:
              "Sifat kerah menahan fokus optik ke area muka, dibantu palet gelap slimming effect.",
            img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Dark Wash Denim",
            cat: "Bawahan",
            reasonTag: "The Fit",
            reasonDesc:
              "Menjaga estafet warna dengan atasan, memanjangkan impresi postur monokromatis.",
            img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Single-Breasted Blazer",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "Elemen padding yang keras mengonstruksi ulang bahu, sementara panjangnya merapikan area pinggang.",
            img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
    },
  },
  en: {
    women: {
      Hourglass: {
        title: "Hourglass",
        introText:
          "Maximize your primary proportions. The golden rule for the Hourglass silhouette.",
        desc: "Your upper and lower body proportions are perfectly balanced with a sharply defined waistline.",
        tipsList: [
          "Make your natural waistline the central focal point of your outfit silhouette.",
          "Avoid oversized or boxy clothing cuts that drown out your natural shape.",
          "Utilize fabrics that naturally drape and follow your bodys contours (flowy/draped).",
        ],
        fits: [
          {
            name: "Wrap Top / Blouse",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "Accentuates the waistline and naturally follows your inherent curves.",
            img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "High-Waist Trousers",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Locks proportions at the narrowest waist area, elongating the legs.",
            img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "V-Neck Midi Dress",
            cat: "Dress",
            reasonTag: "The Fit",
            reasonDesc:
              "Balances upper and lower proportions with a sharp, classic silhouette.",
            img: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Pear: {
        title: "Pear (Triangle)",
        introText:
          "Balance your lower silhouette. The golden rule for the Pear body type.",
        desc: "Your hips and thighs are wider than your shoulders, providing a solid lower foundation.",
        tipsList: [
          "Add structural details around the shoulders or chest to balance overall proportions.",
          "Implement light vivid colors for tops and darker palettes for bottoms.",
          "Opt for straight-leg trousers or A-line skirts to nourish the hip silhouette.",
        ],
        fits: [
          {
            name: "Puff Sleeve Top",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "Adds extra volume to the shoulder area to proportionately balance the hips.",
            img: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Dark Wash Straight",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Dark palettes and straight cuts give an illusion of vertical slimming.",
            img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Off-Shoulder Dress",
            cat: "Dress",
            reasonTag: "The Fit",
            reasonDesc:
              "Exposes the collarbones to draw visual focus towards the upper half.",
            img: "https://images.unsplash.com/photo-1566206091558-f6268976b39c?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      "Inverted Triangle": {
        title: "Inverted Triangle",
        introText:
          "Control top-heavy balance. The golden rule for the Inverted Triangle body type.",
        desc: "Your shoulders and bust circumference are significantly broader than your hips and lower body.",
        tipsList: [
          "Emphasize voluminous details on your bottoms to balance the shoulder line.",
          "Utilize V-necks or deep collars to visually break up a broad chest area.",
          "Palazzo pants, wide-leg culottes, or A-line skirts are your best foundations.",
        ],
        fits: [
          {
            name: "Deep V-Neck Top",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "Breaks up the broad chest plane and gives an illusion of a longer neck.",
            img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Wide-Leg Palazzo",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Adds dimensional volume to the lower half for precise proportion.",
            img: "https://images.unsplash.com/photo-1624378514125-9a8b139ce844?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Pleated A-Line Dress",
            cat: "Dress",
            reasonTag: "The Fit",
            reasonDesc:
              "Creates architectural curves and structural volume in the hip area.",
            img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Rectangle: {
        title: "Athletic (Rectangle)",
        introText:
          "Create a new silhouette. The golden rule for the Athletic type.",
        desc: "The proportions of your bust, waist, and hips are nearly identical, creating a linear, sporty silhouette.",
        tipsList: [
          "Create an artificial waist separator using belts, waistbands, or color-blocking techniques.",
          "Tops with ruffle textures, layers, or peplum cuts add needed dimension.",
          "Flared or bootcut pants provide extra volume, breaking the straight line of your legs.",
        ],
        fits: [
          {
            name: "Peplum Top",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "Structurally creates an artificial waistline with added volume below.",
            img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Flared Denim",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Forms an hourglass profile on a leg silhouette that was initially entirely straight.",
            img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Wrap Dress with Belt",
            cat: "Dress",
            reasonTag: "The Fit",
            reasonDesc:
              "The asymmetrical wrap design paired with a belt automatically sculpts the waist.",
            img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
    },
    men: {
      Trapezoid: {
        title: "Trapezoid",
        introText:
          "The standard of male aesthetics. An ideal silhouette that makes wardrobe variation effortless.",
        desc: "Proportional shoulder and chest width, tapering slowly and constantly down to the waist. Perfect harmony.",
        tipsList: [
          "Wear slim-fit or tailored-fit shirts to highlight your chest architecture.",
          "Almost every type of pant is rational to try, but straight-leg provides the cleanest accent.",
          "Avoid unstructured baggy clothing if you wish to maintain your aesthetic silhouette.",
        ],
        fits: [
          {
            name: "Tailored Slim Shirt",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "Highlights masculine shoulder lines without appearing overly forced.",
            img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Slim-Straight Jeans",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Ideal vertical balance between waist width and leg length.",
            img: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Structured Blazer",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "The suit construction follows the natural torso V-taper, perfecting shoulder shape.",
            img: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      "Inverted Triangle": {
        title: "Extreme V-Taper (Inverted)",
        introText:
          "Control upper body impression. Strategy for ultra-broad shoulders.",
        desc: "Shoulders and chest heavily dominate the overall structure, with an extreme tapering ratio at the waist.",
        tipsList: [
          "Exploit V-neck tops to break up the intensity of an overly dominant chest area.",
          "Use straight-leg or slightly relaxed pants to balance your upper body mass.",
          "Avoid jackets with extra shoulder padding as it will severely distort your silhouette.",
        ],
        fits: [
          {
            name: "V-Neck Basic Tee",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "Directs vision vertically, making your frame appear more fluid.",
            img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Relaxed Fit Chinos",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Provides partial added volume in the lower leg area for overall neatness.",
            img: "https://images.unsplash.com/photo-1624378514125-9a8b139ce844?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Unstructured Jacket",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "Removes shoulder pads so the extreme chest structure becomes more relaxed.",
            img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Rectangle: {
        title: "Linear (Rectangle)",
        introText:
          "Layering experimentation. A crucial strategy for straight vertical silhouettes.",
        desc: "The timeline size of shoulders, chest, and waist is relatively uniform, often found in ectomorph morphologies.",
        tipsList: [
          "Implement dual-layering systems (t-shirt combined with an open button-down shirt) to build chest illusion space.",
          "Opt for horizontal graphic elements to draw a widening illusion across the upper torso.",
          "Slim and straight fit pant profiles must be maintained to ensure a sharp, neat silhouette.",
        ],
        fits: [
          {
            name: "Horizontal Stripe Tee",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "Horizontal lines widen the optical frame, distorting narrow perceptions.",
            img: "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Classic Chinos",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Standard neat formation that does not expose overly straight, thin leg shapes.",
            img: "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Denim / Trucker Jacket",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "The solid (stiff) material of denim contributes artificial masculine chest lines.",
            img: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      Triangle: {
        title: "Triangle",
        introText:
          "Silhouette framing technique. Focus on shifting the center of gravity.",
        desc: "The construction of the stomach or waist area protrudes beyond the size of the shoulders and collarbones.",
        tipsList: [
          "Spatial darkening principle: apply dim color palettes (navy, charcoal) on top to disguise the central area.",
          "Prioritize structured jackets and blazers (padded shoulders) to instantly reproduce top balance.",
          "Do not wear striking clothing patterns centered on the stomach area, and ensure classical, non-tight profiles.",
        ],
        fits: [
          {
            name: "Dark Regular Polo",
            cat: "Top",
            reasonTag: "The Fit",
            reasonDesc:
              "The collar nature retains optical focus towards the face, aided by a dark palette slimming effect.",
            img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Dark Wash Denim",
            cat: "Bottom",
            reasonTag: "The Fit",
            reasonDesc:
              "Maintains color relay with the top, lengthening monochromatic posture impressions.",
            img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
          },
          {
            name: "Single-Breasted Blazer",
            cat: "Outerwear",
            reasonTag: "The Fit",
            reasonDesc:
              "Hard padding elements reconstruct shoulders, while its length neatens the waist area.",
            img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
    },
  },
};
