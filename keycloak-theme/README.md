# Synapxix Keycloak Theme

Custom Keycloak theme for the Synapxix platform with modern, dark-mode-ready design.

## 🚀 Quick Setup

### 1. Import Realm Configuration

1. Access Keycloak Admin Console: `http://localhost:8080`
2. Click **Manage Realms** → **Create Realm**
3. Drag and drop the file `synapxix-realm.json` (or click **Browse**)
4. The realm name will auto-complete to `prueba`
5. Click **Create**

### 2. Configure Theme in Client

1. Go to **Clients** → **angular-client**
2. Scroll to **Login Settings**
3. Set **Login Theme** to `synapxix`
4. Click **Save**

✅ **Done!** Your Keycloak is now configured with the custom theme.

---

## 📁 Theme Structure

```
keycloak-theme/
└── login/
    ├── login.ftl            # Login page
    ├── register.ftl         # Registration page
    ├── template.ftl         # Base template
    ├── theme.properties     # Theme config
    └── resources/
        ├── css/styles.css
        ├── img/
        │   ├── logo.png              # Replace with your logo
        │   └── video-poster.jpg      # Replace with your poster
        └── video/
            └── bg-video.mp4          # Replace with your video
```

## 🎨 Customization

### Replace Assets

Replace these placeholder files with your brand assets:

- `resources/img/logo.png` - Your logo (transparent PNG, 32x32px+)
- `resources/img/video-poster.jpg` - Video poster (16:9 ratio)
- `resources/video/bg-video.mp4` - Background video

### Change Colors

Edit `template.ftl` (lines 16-19):

```javascript
colors: {
  "primary": "#2b7cee",           // Brand color
  "background-light": "#f6f7f8",  // Light background
  "background-dark": "#101822",   // Dark background
}
```

### Testing Changes

1. Edit `.ftl` or resource files
2. Keycloak reloads automatically in dev mode
3. Hard refresh browser (Ctrl+F5)

## 📚 What's Included

The imported realm includes:

- ✅ Realm: `prueba`
- ✅ Client: `angular-client` (public, PKCE enabled)
- ✅ Client: `admin-backend` (bearer-only API)
- ✅ User registration enabled
- ✅ Test user: `admin` / `admin`
- ✅ Spanish/English locales

## 🔧 Development

**View logs:**

```bash
docker logs -f keycloak-server
```

**Verify theme is mounted:**

```bash
docker exec keycloak-server ls /opt/keycloak/themes/synapxix
```

## ⚠️ Production Notes

- Replace all placeholder assets
- Change default admin password
- Enable HTTPS
- Configure proper CSP headers
- Use environment variables for secrets

## 📖 Resources

- [Keycloak Docs](https://www.keycloak.org/docs/latest/)
- [Keycloak Themes](https://www.keycloak.org/docs/latest/server_development/#_themes)
- [Tailwind CSS](https://tailwindcss.com/docs)
