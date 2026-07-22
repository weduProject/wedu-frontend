export interface BuilderOption {
  id: number;
  name: string;
  price: number;
}

export const weddingHallList: BuilderOption[] = [
  {
    id: 1,
    name: "강남 웨딩홀",
    price: 3500000,
  },
  {
    id: 2,
    name: "롯데호텔 웨딩",
    price: 5200000,
  },
  {
    id: 3,
    name: "신라호텔 웨딩",
    price: 6800000,
  },
];

export const seudeumeList: BuilderOption[] = [
  {
    id: 1,
    name: "Basic 패키지",
    price: 1800000,
  },
  {
    id: 2,
    name: "Premium 패키지",
    price: 2500000,
  },
  {
    id: 3,
    name: "Luxury 패키지",
    price: 3600000,
  },
];

export const honeymoonList: BuilderOption[] = [
  {
    id: 1,
    name: "몰디브",
    price: 4200000,
  },
  {
    id: 2,
    name: "하와이",
    price: 3400000,
  },
  {
    id: 3,
    name: "스위스",
    price: 5600000,
  },
];
