interface Service {
  price: number;
  time: string;
}

interface WorkingHour{
    start: string;
    end: string;
}

export interface Shop{
    shopName: string,
    address: string,
    zipcode: number,
    services: Record<string, Service>,
    workingHours: WorkingHour,
    imageUrl: string
}