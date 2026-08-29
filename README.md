# BURN - Metabolic Workout Engine (Android App)

BURN is a high-performance, dark-themed metabolic workout tracking and progressive overload application designed for athletic training splits, custom rest timers, and workout logs.

---

## 📱 How to Build the APK in Android Studio (Step-by-Step Guide)

Follow these simple steps on your laptop to generate the ready-to-install `.apk` file:

### Step 1: Get the Code onto your Laptop
1. In Google AI Studio, click the **GitHub** button in the top right to sync the latest changes to your repository.
2. Go to your repository on GitHub (`https://github.com/NeelanshRai/BURN_FITNESS`).
3. Click the green **`<> Code`** button and select **Download ZIP**.
4. Extract (unzip) the downloaded file into a folder on your computer (e.g. `Downloads/BURN_FITNESS-main`).

---

### Step 2: Open the Project in Android Studio
1. Open **Android Studio** on your laptop.
   *(If you don't have it installed, download it for free from [developer.android.com/studio](https://developer.android.com/studio)).*
2. On the welcome screen, click **Open** (or go to `File` ➔ `Open...`).
3. Navigate to and select the extracted project folder (`BURN_FITNESS-main`).
4. Click **OK / Open**.
5. Wait 1–2 minutes for Gradle to automatically sync dependencies (you will see progress in the bottom status bar).

---

### Step 3: Ensure Debug Keystore is Present (Quick One-Time Step)
Before building, ensure the debug signing key exists in the project root folder:
- **Windows (Command Prompt / PowerShell in project root)**:
  ```cmd
  certutil -decode debug.keystore.base64 debug.keystore
  ```
- **macOS / Linux (Terminal in project root)**:
  ```bash
  base64 -d debug.keystore.base64 > debug.keystore
  ```
*(If `debug.keystore` is already present in your project root, you can skip this step).*

---

### Step 4: Build the APK
1. In Android Studio's top menu bar, click:
   **`Build`** ➔ **`Build Bundle(s) / APK(s)`** ➔ **`Build APK(s)`**
2. Android Studio will compile and package the app (takes ~30–60 seconds).
3. Once the build completes, a popup notification will appear at the bottom-right corner:
   > **APK(s) generated successfully for 1 module:**
   > Click **`locate`** to open the folder with your `.apk`.

---

### Step 5: Where to Find Your APK
Your generated APK is located in:
```
BURN_FITNESS-main/app/build/outputs/apk/debug/app-debug.apk
```

---

### Step 6: Install the APK on your Phone
1. **Transfer the APK to your phone**:
   - Send it via **Google Drive**, **WhatsApp / Telegram Saved Messages**, **Quick Share (Nearby Share)**, or by connecting a USB cable.
2. **Install**:
   - Tap `app-debug.apk` in your phone's File Manager / Downloads.
   - If prompted, allow *"Install unknown apps"* for your file manager or browser.
   - Tap **Install** and launch **BURN**!

---

## 🎨 Icon Features & Nothing OS Support
- **Adaptive Icon**: Custom athletic physique emblem with safe-zone margin alignment on dark background.
- **Nothing OS / Monochrome Themed Icons**: High-contrast polygon facet monochrome layer with alpha transparency for seamless integration with the Nothing Icon Pack and Android 13+ dynamic themed icons.
