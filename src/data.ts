export type BodyShape =
  | "Hourglass"
  | "Pear"
  | "Apple"
  | "Rectangle"
  | "Inverted Triangle";

export interface OutfitRec {
  id: string;
  category: "Tops" | "Bottoms" | "Dresses";
  name: string;
  image: string;
  reason: string;
}

export const SHAPE_INFO: Record<
  BodyShape,
  { description: string; dos: string[]; donts: string[] }
> = {
  Hourglass: {
    description:
      "You've got that classic balanced silhouette! Your bust and hips are relatively equal, with a well-defined waist. Main character energy unlocked.",
    dos: [
      "Wrap dresses and tops",
      "High-waisted bottoms to show off that waist",
      "Belts to accentuate your proportions",
    ],
    donts: [
      "Boxy or oversized tops that hide your waist",
      "Stiff fabrics that don't follow your curves",
    ],
  },
  Pear: {
    description:
      "Serving serious curves! Your hips are wider than your bust, with an elegant, defined waist.",
    dos: [
      "Structured statement tops",
      "A-line skirts and dresses",
      "Darker colors on the bottom",
    ],
    donts: [
      "Skinny jeans or tight pants that throw off proportions",
      "Details or ruffles on the hip area",
    ],
  },
  Apple: {
    description:
      "Vibe check passed! You have broader shoulders and bust, with narrower hips, carrying weight around the midsection.",
    dos: [
      "V-necklines to draw the eye up",
      "Empire waist silhouettes",
      "Fitted tailored sleeves",
    ],
    donts: [
      "Clingy or tight materials on the torso",
      "High necklines or turtle necks",
    ],
  },
  Rectangle: {
    description:
      "Sleek and athletic aesthetic! Your bust, waist, and hips are fairly uniform, giving you a beautiful, balanced canvas to style.",
    dos: [
      "Peplum tops that create waist illusion",
      "Layering to add dimension",
      "Bootcut or wide-leg pants",
    ],
    donts: ["Square-necked, boxy tops", "Straight, shapeless shift dresses"],
  },
  "Inverted Triangle": {
    description:
      "You serve strong aesthetic! Broad shoulders with narrower hips and waist. Let's balance that out.",
    dos: [
      "V-necks and deeper necklines",
      "A-line skirts or wide-leg pants",
      "Peplum tops to add hip volume",
    ],
    donts: [
      "Puff sleeves or shoulder pads",
      "Boat necklines that widen the shoulders",
    ],
  },
};

export const OUTFIT_RECS: Record<BodyShape, OutfitRec[]> = {
  Hourglass: [
    {
      id: "h1",
      category: "Tops",
      name: "Wrap Crop Top",
      image:
        "https://images.unsplash.com/photo-1614774395409-cf8ca7798361?q=80&w=600&auto=format&fit=crop",
      reason: "Cinched exactly at the waist",
    },
    {
      id: "h2",
      category: "Bottoms",
      name: "High-waisted Wide Leg",
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
      reason: "Highlights curves & waist",
    },
    {
      id: "h3",
      category: "Dresses",
      name: "Bodycon Midi",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
      reason: "Follows natural proportions",
    },
  ],
  Pear: [
    {
      id: "p1",
      category: "Tops",
      name: "Puff Sleeve Blouse",
      image:
        "https://images.unsplash.com/photo-1593025251662-7f9a1cb1c75c?q=80&w=600&auto=format&fit=crop",
      reason: "Adds volume to your upper half",
    },
    {
      id: "p2",
      category: "Bottoms",
      name: "A-Line Midi Skirt",
      image:
        "https://images.unsplash.com/photo-1542280756-74b2f55e73e1?q=80&w=600&auto=format&fit=crop",
      reason: "Glides over hips smoothly",
    },
    {
      id: "p3",
      category: "Dresses",
      name: "Fit and Flare Dress",
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop",
      reason: "Accentuates waist & softens hips",
    },
  ],
  Apple: [
    {
      id: "a1",
      category: "Tops",
      name: "Deep V-Neck Tunic",
      image:
        "https://images.unsplash.com/photo-1564222045582-706509f69201?q=80&w=600&auto=format&fit=crop",
      reason: "Draws attention upwards",
    },
    {
      id: "a2",
      category: "Bottoms",
      name: "Straight-leg Trousers",
      image:
        "https://images.unsplash.com/photo-1584860475855-66236b2baabc?q=80&w=600&auto=format&fit=crop",
      reason: "Balances the midsection",
    },
    {
      id: "a3",
      category: "Dresses",
      name: "Empire Waist Dress",
      image:
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600&auto=format&fit=crop",
      reason: "Gives shape just under the bust",
    },
  ],
  Rectangle: [
    {
      id: "r1",
      category: "Tops",
      name: "Belted Peplum Top",
      image:
        "https://images.unsplash.com/photo-1434389678369-182cb1924618?q=80&w=600&auto=format&fit=crop",
      reason: "Creates the illusion of curves",
    },
    {
      id: "r2",
      category: "Bottoms",
      name: "Bootcut Jeans",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop",
      reason: "Adds dimension to lower half",
    },
    {
      id: "r3",
      category: "Dresses",
      name: "Wrap Dress",
      image:
        "https://images.unsplash.com/photo-1618932260643-ee462624d776?q=80&w=600&auto=format&fit=crop",
      reason: "Defines a waistline beautifully",
    },
  ],
  "Inverted Triangle": [
    {
      id: "it1",
      category: "Tops",
      name: "Halter Neck Top",
      image:
        "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=600&auto=format&fit=crop",
      reason: "Breaks up broad shoulders",
    },
    {
      id: "it2",
      category: "Bottoms",
      name: "Pleated Wide Leg",
      image:
        "https://images.unsplash.com/photo-1584860475855-66236b2baabc?q=80&w=600&auto=format&fit=crop",
      reason: "Balances out shoulder width",
    },
    {
      id: "it3",
      category: "Dresses",
      name: "Tiered Maxi Dress",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
      reason: "Adds volume to lower body",
    },
  ],
};
