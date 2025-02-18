export interface LineItem {
    itemName: string
    quantity: number
    price: number
}

export interface Order {
    name: string
    address: string
    email: string
    deliveryDate: string
    rush: boolean
    lineItems: LineItem[]
}