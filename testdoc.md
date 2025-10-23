# Creating a WordPress Child Theme

## 1. Problem/Case Description
Many WordPress users need to customize their website’s theme without losing changes during updates. Directly modifying a parent theme can result in lost customizations when the theme is updated. The solution is to create a **child theme**, which inherits functionality and styling from the parent theme while allowing safe modifications.

---
 
## 2. Symptoms / Steps for Recreation

**Symptoms / Challenges Without a Child Theme:**

- Custom CSS or PHP changes are lost after updating the parent theme.
- Difficulty maintaining site customization without breaking theme functionality.
- Updates to parent theme may override templates or functions.

---

## 3. Expected Result / End Goal

**Goal:**

- Create a child theme that safely inherits the parent theme’s functionality and styles.
- Allow customizations (CSS, PHP, or template files) without affecting the parent theme.
- Ensure updates to the parent theme do not overwrite custom modifications.

**Success Criteria:**

- Child theme appears in WordPress Dashboard → Appearance → Themes.
- Website loads correctly using the child theme.
- Custom styles or template changes applied in the child theme are reflected on the site.

---

## 4. Resolution Steps

1. Navigate to `wp-content/themes/`.
2. Create a new folder named `<parent-theme-name>-child` (e.g., `hello-elementor-child`).
3. In the child theme folder, create `style.css` and add the following header:

```css
/*
 Theme Name:   Hello Elementor Child
 Description:  Child theme for Hello Elementor
 Template:     hello-elementor
 Version:      1.0.0
*/
```

4. Create `functions.php` and add this code to enqueue parent styles:

```php
<?php
function my_child_theme_enqueue_styles() {
    $parenthandle = 'parent-style';
    wp_enqueue_style( $parenthandle, get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'child-style', get_stylesheet_uri(), array( $parenthandle ) );
}
add_action( 'wp_enqueue_scripts', 'my_child_theme_enqueue_styles' );
?>
```

5. Activate the child theme in WordPress.
6. Verify everything is working correctly:

- The design of the site has not changed.
- The new child theme is listed in WordPress backend → Appearance → Themes.
