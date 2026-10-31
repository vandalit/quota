use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};

/// Position the window at the bottom-right of the primary monitor,
/// just above the taskbar. Called every time the window is shown so it
/// adapts to resolution or taskbar-height changes.
fn position_window_bottom_right<R: Runtime>(app: &tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        if let Ok(monitor) = window.primary_monitor() {
            if let Some(monitor) = monitor {
                let monitor_size = monitor.size();
                let scale = monitor.scale_factor();

                // Window size in physical pixels
                let win_size = window.outer_size().unwrap_or_default();

                // Taskbar offset in physical pixels (approx 48px logical)
                let taskbar_offset = (48.0 * scale) as u32;
                let margin = (8.0 * scale) as u32;

                let x = (monitor_size.width as i32)
                    - (win_size.width as i32)
                    - (margin as i32);
                let y = (monitor_size.height as i32)
                    - (win_size.height as i32)
                    - (taskbar_offset as i32)
                    - (margin as i32);

                let _ = window.set_position(tauri::PhysicalPosition::new(x, y));
            }
        }
    }
}

/// Toggle the main window visibility.
fn toggle_window<R: Runtime>(app: &tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            position_window_bottom_right(app);
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .setup(|app| {
            // Build tray icon menu
            let quit = MenuItemBuilder::new("Quit Quota Tracker")
                .id("quit")
                .build(app)?;
            let show = MenuItemBuilder::new("Show / Hide")
                .id("toggle")
                .build(app)?;
            let menu = MenuBuilder::new(app).items(&[&show, &quit]).build()?;

            // Build tray icon
            let _tray = TrayIconBuilder::with_id("quota-tray")
                .tooltip("Quota Tracker")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false) // left click toggles window, not menu
                .on_tray_icon_event(|tray, event| {
                    // Left-click: toggle window
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        toggle_window(tray.app_handle());
                    }
                })
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "toggle" => toggle_window(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .build(app)?;

            // Hide window from taskbar on startup (already set in config,
            // but belt-and-suspenders for dev mode)
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            // Intercept the close button: hide instead of quit
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
