import path from "path";
import { fileURLToPath } from "url";
import i18n from "i18n"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, '../common/messages'),
  defaultLocale: 'en',
  objectNotation: true,
  header: 'accept-language'
});

export default i18n