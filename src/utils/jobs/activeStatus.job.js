import cron from "node-cron";
import { Course } from "../../db/model/course.js";


//work evey day 
cron.schedule("0 0 * * *", async () => {
    const now = new Date();

    try {
        // Activate courses at start of the time
        await Course.updateMany(
            { startAt: { $lte: now }, isActive: false },
            { isActive: true }
        );

        //stop courses at end of the time
        await Course.updateMany(
            { endAt: { $lte: now }, isActive: true },
            { isActive: false }
        );
    } catch (err) {
        console.error("Cron job error:", err);
    }
});