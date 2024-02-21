import { LoginFormData } from "./pages/Login";
import { RegisterFormData } from "./pages/Register";
import { HotelType, SearchResponse } from '../../backend/src/shared/types';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}


export const login = async (formData: LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}


export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Invalid Token");
    }

    return response.json();
}

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error during Logout");
    }
};


export const addHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`, {
        method: 'POST',
        credentials: "include",
        body: hotelFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to add Hotel");
    }

    return response.json();
};


export const loadHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load hotels");
    }

    return response.json();
};


export const loadHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to load hotels");
    }
    return response.json();
}


export const updateHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        body: hotelFormData,
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Failed to update hotels");
    }
    return response.json();
}


export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
}

export const searchHotels = async (searchParams: SearchParams): Promise<SearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");
    queryParams.append("page", searchParams.page || "");

    searchParams.facilities?.forEach((facility) => queryParams.append("facilities", facility));
    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));



    const response = await fetch(`${API_BASE_URL}/api/home/search?${queryParams}`);
    if (!response.ok) {
        throw new Error("Error searching hotels");
    }
    return response.json();
}