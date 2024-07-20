import express from "express";
import config from "../../config";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await fetch(`https://api.imgur.com/3/album/${config.imgur.album_id}/images`, {
            headers: {
                Authorization: `Client-ID ${config.imgur.id}`,
            },
        });

        const { data } = await response.json();

        const image_urls = (data as { link: string }[]).map((img) => img.link);

        res.json(image_urls);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not get all items at this time" });
    }
});

export default router;
