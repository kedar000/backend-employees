import { writeFile } from "fs/promises";
import bcrypt from "bcrypt";

const DUMMY_JSON_URL = "https://dummyjson.com/users?limit=100";

async function seed() {
    console.log("Downloading employee data...");

    const response = await fetch(DUMMY_JSON_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch DummyJSON users.");
    }

    const data = await response.json();

    const employees = data.users.map((user) => ({
        id: user.id,

        firstName: user.firstName,
        lastName: user.lastName,

        email: user.email,
        phone: user.phone,

        age: user.age,
        image: user.image,

        company: {
            department: user.company.department,
            title: user.company.title,
        },

        // Additional phone numbers
        contacts: [
            user.phone,
            `+1-555-${String(user.id).padStart(4, "0")}`,
            `+1-800-${String(user.id).padStart(4, "0")}`,
        ],

        // Multiple addresses
        addresses: [
            {
                type: "Home",
                address: user.address.address,
                city: user.address.city,
                state: user.address.state,
                stateCode: user.address.stateCode,
                postalCode: user.address.postalCode,
                country: user.address.country,
                coordinates: {
                    lat: user.address.coordinates.lat,
                    lng: user.address.coordinates.lng,
                },
            },
            {
                type: "Office",
                address: `${100 + user.id} Corporate Park`,
                city: user.address.city,
                state: user.address.state,
                stateCode: user.address.stateCode,
                postalCode: user.address.postalCode,
                country: user.address.country,
                coordinates: {
                    lat: user.address.coordinates.lat + 0.02,
                    lng: user.address.coordinates.lng + 0.02,
                },
            },
        ],
    }));

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const db = {
        users: [
            {
                id: 1,
                username: "admin",
                password: hashedPassword,
                role: "ADMIN",
            },
        ],

        refreshTokens: [],

        employees,
    };

    await writeFile(
        "./data/db.json",
        JSON.stringify(db, null, 2),
        "utf8"
    );

    console.log("=================================");
    console.log("Database seeded successfully.");
    console.log(`Employees : ${employees.length}`);
    console.log("");
    console.log("Admin Credentials");
    console.log("Username : admin");
    console.log("Password : admin123");
    console.log("=================================");
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});