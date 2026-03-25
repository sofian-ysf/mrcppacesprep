# MRCPPACESPREP Flutter App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a native iOS Flutter app for MRCPPACESPREP with full offline support, allowing paying subscribers to study MRCP PACES exam questions, flashcards, and mock exams.

**Architecture:** Feature-first with Riverpod state management and Drift (SQLite) for offline storage. Each feature is self-contained with its own data layer, providers, and UI. Sync service manages bidirectional data synchronization with Supabase.

**Tech Stack:** Flutter 3.19+, Riverpod, GoRouter, Drift, Supabase, Sign in with Apple

---

## Phase 1: Project Setup & Core Infrastructure

### Task 1: Create Flutter Project

**Files:**
- Create: `flutter_app/` (new Flutter project)

**Step 1: Create the Flutter project**

Run:
```bash
cd /Users/sofianyoussef/Desktop/Other\ Projects/mrcppacesprep
flutter create flutter_app --org com.mrcppacesprep --platforms ios
```
Expected: New Flutter project created with iOS support

**Step 2: Verify project structure**

Run:
```bash
cd flutter_app && flutter doctor && flutter run --dry-run
```
Expected: No critical issues, iOS target available

**Step 3: Commit**

```bash
cd /Users/sofianyoussef/Desktop/Other\ Projects/mrcppacesprep
git add flutter_app/
git commit -m "feat(flutter): initialize Flutter project for iOS"
```

---

### Task 2: Configure Dependencies

**Files:**
- Modify: `flutter_app/pubspec.yaml`

**Step 1: Update pubspec.yaml with all dependencies**

Replace contents of `flutter_app/pubspec.yaml`:

```yaml
name: mrcppacesprep
description: MRCP PACES Exam Preparation App
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # Core
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.5
  go_router: ^14.0.0

  # Supabase
  supabase_flutter: ^2.5.0

  # Apple Sign-In
  sign_in_with_apple: ^6.1.0
  crypto: ^3.0.3

  # Local Database
  drift: ^2.16.0
  sqlite3_flutter_libs: ^0.5.0
  path_provider: ^2.1.0
  path: ^1.9.0

  # Offline & Sync
  connectivity_plus: ^6.0.0
  flutter_secure_storage: ^9.0.0

  # UI Components
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  fl_chart: ^0.68.0
  flutter_animate: ^4.5.0

  # Utilities
  intl: ^0.19.0
  uuid: ^4.4.0
  equatable: ^2.0.5
  freezed_annotation: ^2.4.0
  json_annotation: ^4.9.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  build_runner: ^2.4.0
  drift_dev: ^2.16.0
  riverpod_generator: ^2.4.0
  freezed: ^2.5.0
  json_serializable: ^6.8.0

flutter:
  uses-material-design: true

  fonts:
    - family: Poppins
      fonts:
        - asset: assets/fonts/Poppins/Poppins-Thin.ttf
          weight: 100
        - asset: assets/fonts/Poppins/Poppins-ExtraLight.ttf
          weight: 200
        - asset: assets/fonts/Poppins/Poppins-Light.ttf
          weight: 300
        - asset: assets/fonts/Poppins/Poppins-Regular.ttf
          weight: 400
        - asset: assets/fonts/Poppins/Poppins-Medium.ttf
          weight: 500
        - asset: assets/fonts/Poppins/Poppins-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Poppins/Poppins-Bold.ttf
          weight: 700
        - asset: assets/fonts/Poppins/Poppins-ExtraBold.ttf
          weight: 800
        - asset: assets/fonts/Poppins/Poppins-Black.ttf
          weight: 900

  assets:
    - assets/images/
    - assets/icons/
```

**Step 2: Install dependencies**

Run:
```bash
cd /Users/sofianyoussef/Desktop/Other\ Projects/mrcppacesprep/flutter_app
flutter pub get
```
Expected: All dependencies resolved successfully

**Step 3: Commit**

```bash
git add pubspec.yaml pubspec.lock
git commit -m "feat(flutter): add project dependencies"
```

---

### Task 3: Add Poppins Font Assets

**Files:**
- Create: `flutter_app/assets/fonts/Poppins/` (download font files)
- Create: `flutter_app/assets/images/.gitkeep`
- Create: `flutter_app/assets/icons/.gitkeep`

**Step 1: Create asset directories and download fonts**

Run:
```bash
cd /Users/sofianyoussef/Desktop/Other\ Projects/mrcppacesprep/flutter_app
mkdir -p assets/fonts/Poppins assets/images assets/icons
touch assets/images/.gitkeep assets/icons/.gitkeep

# Download Poppins from Google Fonts
curl -L "https://fonts.google.com/download?family=Poppins" -o /tmp/poppins.zip
unzip -o /tmp/poppins.zip -d /tmp/poppins
cp /tmp/poppins/Poppins-*.ttf assets/fonts/Poppins/
rm -rf /tmp/poppins /tmp/poppins.zip
```
Expected: Font files in assets/fonts/Poppins/

**Step 2: Verify fonts exist**

Run:
```bash
ls -la assets/fonts/Poppins/
```
Expected: Poppins-Regular.ttf, Poppins-Bold.ttf, etc.

**Step 3: Commit**

```bash
git add assets/
git commit -m "feat(flutter): add Poppins font and asset directories"
```

---

### Task 4: Create Core Constants

**Files:**
- Create: `flutter_app/lib/core/constants/colors.dart`
- Create: `flutter_app/lib/core/constants/strings.dart`
- Create: `flutter_app/lib/core/constants/api.dart`

**Step 1: Create colors.dart**

Create `flutter_app/lib/core/constants/colors.dart`:

```dart
import 'package:flutter/material.dart';

abstract class AppColors {
  // Brand
  static const primaryPurple = Color(0xFF5E2373);

  // Backgrounds
  static const background = Color(0xFFFBFAF4);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceGlass = Color(0xCCFFFFFF); // 80% opacity

  // Text
  static const textPrimary = Color(0xFF171717);
  static const textSecondary = Color(0xFF6B7280);

  // Semantic
  static const success = Color(0xFF22C55E);
  static const warning = Color(0xFFF59E0B);
  static const error = Color(0xFFEF4444);

  // Borders
  static const borderLight = Color(0x33FFFFFF); // 20% white
  static const borderGray = Color(0xFFE5E7EB);
}
```

**Step 2: Create strings.dart**

Create `flutter_app/lib/core/constants/strings.dart`:

```dart
abstract class AppStrings {
  static const appName = 'MRCPPACESPREP';
  static const tagline = 'Ace your MRCP PACES exam with 2000+ practice questions';

  // Auth
  static const signIn = 'Sign In';
  static const signUp = 'Sign Up';
  static const signInWithApple = 'Sign in with Apple';
  static const email = 'Email';
  static const password = 'Password';
  static const confirmPassword = 'Confirm Password';
  static const forgotPassword = 'Forgot password?';
  static const noAccount = "Don't have an account?";
  static const hasAccount = 'Already have an account?';

  // Navigation
  static const home = 'Home';
  static const questions = 'Questions';
  static const study = 'Study';
  static const progress = 'Progress';
  static const settings = 'Settings';

  // Features
  static const questionBank = 'Question Bank';
  static const calculations = 'Calculations';
  static const mockExams = 'Mock Exams';
  static const flashcards = 'Flashcards';
  static const achievements = 'Achievements';
  static const bookmarks = 'Bookmarks';
  static const notes = 'Notes';

  // Sync
  static const offline = "You're offline. Changes will sync when connected.";
  static const syncing = 'Syncing...';
  static const lastSynced = 'Last synced';
  static const syncNow = 'Sync Now';
}
```

**Step 3: Create api.dart**

Create `flutter_app/lib/core/constants/api.dart`:

```dart
abstract class ApiConstants {
  static const supabaseUrl = 'https://acxysqblbiptefqmvzxo.supabase.co';
  static const supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: '',
  );

  // Table names
  static const tableQuestions = 'questions';
  static const tableCategories = 'question_categories';
  static const tableFlashcardDecks = 'flashcard_decks';
  static const tableFlashcards = 'flashcards';
  static const tableAchievements = 'achievements';
  static const tableUserAnswers = 'user_answers';
  static const tableUserQuestionProgress = 'user_question_progress';
  static const tableUserFlashcardProgress = 'user_flashcard_progress';
  static const tableUserBookmarks = 'user_bookmarks';
  static const tableUserNotes = 'user_notes';
  static const tableUserAchievements = 'user_achievements';
  static const tableUserDailyActivity = 'user_daily_activity';
  static const tableUserSettings = 'user_settings';
  static const tableUserSubscriptions = 'user_subscriptions';
  static const tableMockExamResults = 'mock_exam_results';
}
```

**Step 4: Create barrel export**

Create `flutter_app/lib/core/constants/constants.dart`:

```dart
export 'colors.dart';
export 'strings.dart';
export 'api.dart';
```

**Step 5: Commit**

```bash
git add lib/core/
git commit -m "feat(flutter): add core constants (colors, strings, api)"
```

---

### Task 5: Create Theme Configuration

**Files:**
- Create: `flutter_app/lib/core/theme/app_theme.dart`
- Create: `flutter_app/lib/core/theme/text_styles.dart`

**Step 1: Create text_styles.dart**

Create `flutter_app/lib/core/theme/text_styles.dart`:

```dart
import 'package:flutter/material.dart';
import '../constants/colors.dart';

abstract class AppTextStyles {
  static const _fontFamily = 'Poppins';

  static const displayLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.2,
  );

  static const headlineLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.2,
  );

  static const titleLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.3,
  );

  static const titleMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.3,
  );

  static const bodyLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
    height: 1.6,
  );

  static const bodyMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
    height: 1.6,
  );

  static const labelLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static const labelMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.textSecondary,
  );

  static const caption = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
    height: 1.4,
  );
}
```

**Step 2: Create app_theme.dart**

Create `flutter_app/lib/core/theme/app_theme.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/colors.dart';
import 'text_styles.dart';

abstract class AppTheme {
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: 'Poppins',

      // Colors
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryPurple,
        secondary: AppColors.primaryPurple,
        surface: AppColors.surface,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimary,
        onError: Colors.white,
      ),

      scaffoldBackgroundColor: AppColors.background,

      // AppBar
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
        titleTextStyle: AppTextStyles.titleLarge,
        iconTheme: IconThemeData(color: AppColors.textPrimary),
      ),

      // Text
      textTheme: const TextTheme(
        displayLarge: AppTextStyles.displayLarge,
        headlineLarge: AppTextStyles.headlineLarge,
        titleLarge: AppTextStyles.titleLarge,
        titleMedium: AppTextStyles.titleMedium,
        bodyLarge: AppTextStyles.bodyLarge,
        bodyMedium: AppTextStyles.bodyMedium,
        labelLarge: AppTextStyles.labelLarge,
        labelMedium: AppTextStyles.labelMedium,
      ),

      // Input
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceGlass,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(9999),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(9999),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(9999),
          borderSide: const BorderSide(color: AppColors.primaryPurple, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(9999),
          borderSide: const BorderSide(color: AppColors.error, width: 1),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        hintStyle: AppTextStyles.bodyLarge.copyWith(color: AppColors.textSecondary),
      ),

      // Elevated Button
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.textPrimary,
          foregroundColor: Colors.white,
          elevation: 4,
          shadowColor: Colors.black26,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(9999),
          ),
          textStyle: AppTextStyles.labelLarge.copyWith(color: Colors.white),
        ),
      ),

      // Outlined Button
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.textPrimary,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(9999),
          ),
          side: const BorderSide(color: AppColors.borderGray),
          textStyle: AppTextStyles.labelLarge,
        ),
      ),

      // Text Button
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primaryPurple,
          textStyle: AppTextStyles.labelMedium.copyWith(
            color: AppColors.primaryPurple,
          ),
        ),
      ),

      // Bottom Navigation
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.primaryPurple,
        unselectedItemColor: AppColors.textSecondary,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 12,
          fontWeight: FontWeight.w400,
        ),
      ),

      // Card
      cardTheme: CardTheme(
        color: AppColors.surfaceGlass,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        margin: EdgeInsets.zero,
      ),

      // Divider
      dividerTheme: const DividerThemeData(
        color: AppColors.borderGray,
        thickness: 1,
      ),
    );
  }
}
```

**Step 3: Create barrel export**

Create `flutter_app/lib/core/theme/theme.dart`:

```dart
export 'app_theme.dart';
export 'text_styles.dart';
```

**Step 4: Commit**

```bash
git add lib/core/theme/
git commit -m "feat(flutter): add app theme with Poppins and glassmorphism styling"
```

---

### Task 6: Create Shared Widgets - GlassCard

**Files:**
- Create: `flutter_app/lib/shared/widgets/glass_card.dart`

**Step 1: Create glass_card.dart**

Create `flutter_app/lib/shared/widgets/glass_card.dart`:

```dart
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';

class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(24),
    this.margin,
    this.borderRadius = 16,
    this.blur = 10,
    this.opacity = 0.8,
    this.onTap,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final double blur;
  final double opacity;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final card = ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(opacity),
            borderRadius: BorderRadius.circular(borderRadius),
            border: Border.all(
              color: AppColors.borderLight,
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );

    if (onTap != null) {
      return Padding(
        padding: margin ?? EdgeInsets.zero,
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(borderRadius),
            child: card,
          ),
        ),
      );
    }

    return Padding(
      padding: margin ?? EdgeInsets.zero,
      child: card,
    );
  }
}
```

**Step 2: Commit**

```bash
git add lib/shared/widgets/
git commit -m "feat(flutter): add GlassCard widget with backdrop blur"
```

---

### Task 7: Create Shared Widgets - PillButton

**Files:**
- Create: `flutter_app/lib/shared/widgets/pill_button.dart`

**Step 1: Create pill_button.dart**

Create `flutter_app/lib/shared/widgets/pill_button.dart`:

```dart
import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/constants/colors.dart';
import '../../core/theme/text_styles.dart';

enum PillButtonVariant { primary, secondary, ghost, outline }
enum PillButtonSize { sm, md, lg, xl }

class PillButton extends StatelessWidget {
  const PillButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = PillButtonVariant.primary,
    this.size = PillButtonSize.md,
    this.icon,
    this.iconPosition = IconPosition.left,
    this.isLoading = false,
    this.isDisabled = false,
    this.fullWidth = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final PillButtonVariant variant;
  final PillButtonSize size;
  final IconData? icon;
  final IconPosition iconPosition;
  final bool isLoading;
  final bool isDisabled;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    final padding = _getPadding();
    final textStyle = _getTextStyle();
    final iconSize = _getIconSize();

    Widget child = Row(
      mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SizedBox(
            width: iconSize,
            height: iconSize,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation(_getForegroundColor()),
            ),
          ),
          const SizedBox(width: 8),
        ] else if (icon != null && iconPosition == IconPosition.left) ...[
          Icon(icon, size: iconSize, color: _getForegroundColor()),
          const SizedBox(width: 8),
        ],
        Text(label, style: textStyle.copyWith(color: _getForegroundColor())),
        if (!isLoading && icon != null && iconPosition == IconPosition.right) ...[
          const SizedBox(width: 8),
          Icon(icon, size: iconSize, color: _getForegroundColor()),
        ],
      ],
    );

    switch (variant) {
      case PillButtonVariant.primary:
        return _buildPrimaryButton(child, padding);
      case PillButtonVariant.secondary:
        return _buildSecondaryButton(child, padding);
      case PillButtonVariant.ghost:
        return _buildGhostButton(child, padding);
      case PillButtonVariant.outline:
        return _buildOutlineButton(child, padding);
    }
  }

  Widget _buildPrimaryButton(Widget child, EdgeInsets padding) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(9999),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: isDisabled || isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.textPrimary,
          foregroundColor: Colors.white,
          padding: padding,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(9999),
          ),
          elevation: 0,
        ),
        child: child,
      ),
    );
  }

  Widget _buildSecondaryButton(Widget child, EdgeInsets padding) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(9999),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.8),
            borderRadius: BorderRadius.circular(9999),
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: isDisabled || isLoading ? null : onPressed,
              borderRadius: BorderRadius.circular(9999),
              child: Padding(padding: padding, child: child),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGhostButton(Widget child, EdgeInsets padding) {
    return TextButton(
      onPressed: isDisabled || isLoading ? null : onPressed,
      style: TextButton.styleFrom(
        padding: padding,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(9999),
        ),
      ),
      child: child,
    );
  }

  Widget _buildOutlineButton(Widget child, EdgeInsets padding) {
    return OutlinedButton(
      onPressed: isDisabled || isLoading ? null : onPressed,
      style: OutlinedButton.styleFrom(
        padding: padding,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(9999),
        ),
        side: const BorderSide(color: AppColors.borderGray),
      ),
      child: child,
    );
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case PillButtonSize.sm:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
      case PillButtonSize.md:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 12);
      case PillButtonSize.lg:
        return const EdgeInsets.symmetric(horizontal: 32, vertical: 16);
      case PillButtonSize.xl:
        return const EdgeInsets.symmetric(horizontal: 40, vertical: 20);
    }
  }

  TextStyle _getTextStyle() {
    switch (size) {
      case PillButtonSize.sm:
        return AppTextStyles.labelMedium;
      case PillButtonSize.md:
      case PillButtonSize.lg:
        return AppTextStyles.labelLarge;
      case PillButtonSize.xl:
        return AppTextStyles.titleMedium;
    }
  }

  double _getIconSize() {
    switch (size) {
      case PillButtonSize.sm:
        return 16;
      case PillButtonSize.md:
        return 20;
      case PillButtonSize.lg:
        return 24;
      case PillButtonSize.xl:
        return 28;
    }
  }

  Color _getForegroundColor() {
    if (isDisabled) return AppColors.textSecondary;
    switch (variant) {
      case PillButtonVariant.primary:
        return Colors.white;
      case PillButtonVariant.secondary:
      case PillButtonVariant.ghost:
      case PillButtonVariant.outline:
        return AppColors.textPrimary;
    }
  }
}

enum IconPosition { left, right }
```

**Step 2: Commit**

```bash
git add lib/shared/widgets/pill_button.dart
git commit -m "feat(flutter): add PillButton widget with variants"
```

---

### Task 8: Create Shared Widgets Barrel Export

**Files:**
- Create: `flutter_app/lib/shared/widgets/widgets.dart`
- Create: `flutter_app/lib/shared/shared.dart`

**Step 1: Create widgets barrel**

Create `flutter_app/lib/shared/widgets/widgets.dart`:

```dart
export 'glass_card.dart';
export 'pill_button.dart';
```

**Step 2: Create shared barrel**

Create `flutter_app/lib/shared/shared.dart`:

```dart
export 'widgets/widgets.dart';
```

**Step 3: Commit**

```bash
git add lib/shared/
git commit -m "feat(flutter): add shared widgets barrel exports"
```

---

### Task 9: Setup Drift Database

**Files:**
- Create: `flutter_app/lib/core/database/database.dart`
- Create: `flutter_app/lib/core/database/tables/questions.dart`
- Create: `flutter_app/lib/core/database/tables/categories.dart`
- Create: `flutter_app/lib/core/database/tables/flashcards.dart`
- Create: `flutter_app/lib/core/database/tables/user_progress.dart`
- Create: `flutter_app/lib/core/database/tables/sync_status.dart`

**Step 1: Create categories table**

Create `flutter_app/lib/core/database/tables/categories.dart`:

```dart
import 'package:drift/drift.dart';

class QuestionCategories extends Table {
  TextColumn get id => text()();
  TextColumn get slug => text().unique()();
  TextColumn get name => text()();
  TextColumn get description => text().nullable()();
  TextColumn get questionType => text()(); // 'clinical' or 'calculation'
  TextColumn get icon => text().nullable()();
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
```

**Step 2: Create questions table**

Create `flutter_app/lib/core/database/tables/questions.dart`:

```dart
import 'package:drift/drift.dart';
import 'categories.dart';

class Questions extends Table {
  TextColumn get id => text()();
  TextColumn get categoryId => text().references(QuestionCategories, #id)();
  TextColumn get questionType => text()(); // 'sba', 'emq', 'calculation'
  TextColumn get difficulty => text()(); // 'Easy', 'Medium', 'Hard'
  TextColumn get questionText => text()();
  TextColumn get options => text()(); // JSON string
  TextColumn get correctAnswer => text()();
  TextColumn get explanation => text()();
  TextColumn get explanationStructured => text().nullable()(); // JSON string
  TextColumn get sourceReferences => text().nullable()(); // JSON string
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
```

**Step 3: Create flashcards tables**

Create `flutter_app/lib/core/database/tables/flashcards.dart`:

```dart
import 'package:drift/drift.dart';

class FlashcardDecks extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get slug => text().unique()();
  TextColumn get description => text().nullable()();
  IntColumn get cardCount => integer().withDefault(const Constant(0))();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class Flashcards extends Table {
  TextColumn get id => text()();
  TextColumn get deckId => text().references(FlashcardDecks, #id)();
  TextColumn get front => text()();
  TextColumn get back => text()();
  TextColumn get mediaFiles => text().nullable()(); // JSON string
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
```

**Step 4: Create user progress tables**

Create `flutter_app/lib/core/database/tables/user_progress.dart`:

```dart
import 'package:drift/drift.dart';
import 'questions.dart';
import 'flashcards.dart';

class UserAnswers extends Table {
  TextColumn get id => text()();
  TextColumn get questionId => text().references(Questions, #id)();
  TextColumn get selectedAnswer => text()();
  BoolColumn get isCorrect => boolean()();
  IntColumn get timeTakenSeconds => integer().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class UserQuestionProgress extends Table {
  TextColumn get id => text()();
  TextColumn get questionId => text().references(Questions, #id)();
  RealColumn get easeFactor => real().withDefault(const Constant(2.5))();
  IntColumn get intervalDays => integer().withDefault(const Constant(0))();
  IntColumn get repetitions => integer().withDefault(const Constant(0))();
  DateTimeColumn get dueDate => dateTime()();
  IntColumn get timesCorrect => integer().withDefault(const Constant(0))();
  IntColumn get timesIncorrect => integer().withDefault(const Constant(0))();
  DateTimeColumn get lastReviewedAt => dateTime().nullable()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class UserFlashcardProgress extends Table {
  TextColumn get id => text()();
  TextColumn get flashcardId => text().references(Flashcards, #id)();
  RealColumn get easeFactor => real().withDefault(const Constant(2.5))();
  IntColumn get intervalDays => integer().withDefault(const Constant(0))();
  IntColumn get repetitions => integer().withDefault(const Constant(0))();
  DateTimeColumn get dueDate => dateTime()();
  DateTimeColumn get lastReviewedAt => dateTime().nullable()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class UserBookmarks extends Table {
  TextColumn get id => text()();
  TextColumn get questionId => text().references(Questions, #id)();
  TextColumn get note => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class UserNotes extends Table {
  TextColumn get id => text()();
  TextColumn get questionId => text().nullable()();
  TextColumn get flashcardId => text().nullable()();
  TextColumn get content => text()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class Achievements extends Table {
  TextColumn get id => text()();
  TextColumn get slug => text().unique()();
  TextColumn get name => text()();
  TextColumn get description => text()();
  TextColumn get icon => text()();
  TextColumn get category => text()();
  TextColumn get requirementType => text()();
  IntColumn get requirementValue => integer()();
  TextColumn get rarity => text().withDefault(const Constant('common'))();
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class UserAchievements extends Table {
  TextColumn get visibleId => text()();
  TextColumn get achievementId => text().references(Achievements, #id)();
  DateTimeColumn get earnedAt => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {visibleId};
}

class UserDailyActivity extends Table {
  TextColumn get id => text()();
  DateTimeColumn get activityDate => dateTime()();
  IntColumn get questionsAnswered => integer().withDefault(const Constant(0))();
  IntColumn get questionsCorrect => integer().withDefault(const Constant(0))();
  IntColumn get flashcardsReviewed => integer().withDefault(const Constant(0))();
  IntColumn get mockExamsCompleted => integer().withDefault(const Constant(0))();
  IntColumn get studyTimeSeconds => integer().withDefault(const Constant(0))();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class MockExamResults extends Table {
  TextColumn get id => text()();
  TextColumn get examType => text()(); // 'full', 'mini', 'calculation'
  TextColumn get examName => text()();
  IntColumn get totalQuestions => integer()();
  IntColumn get answeredQuestions => integer()();
  IntColumn get correctAnswers => integer()();
  IntColumn get scorePercentage => integer()();
  IntColumn get timeTakenSeconds => integer()();
  IntColumn get timeLimitSeconds => integer()();
  DateTimeColumn get completedAt => dateTime()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}
```

**Step 5: Create sync status table**

Create `flutter_app/lib/core/database/tables/sync_status.dart`:

```dart
import 'package:drift/drift.dart';

class SyncStatuses extends Table {
  TextColumn get tableName => text()();
  DateTimeColumn get lastSyncedAt => dateTime().nullable()();
  IntColumn get totalRecords => integer().withDefault(const Constant(0))();
  IntColumn get pendingUploads => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {tableName};
}
```

**Step 6: Create main database file**

Create `flutter_app/lib/core/database/database.dart`:

```dart
import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

import 'tables/categories.dart';
import 'tables/questions.dart';
import 'tables/flashcards.dart';
import 'tables/user_progress.dart';
import 'tables/sync_status.dart';

part 'database.g.dart';

@DriftDatabase(tables: [
  // Content
  QuestionCategories,
  Questions,
  FlashcardDecks,
  Flashcards,
  Achievements,
  // User progress
  UserAnswers,
  UserQuestionProgress,
  UserFlashcardProgress,
  UserBookmarks,
  UserNotes,
  UserAchievements,
  UserDailyActivity,
  MockExamResults,
  // Sync
  SyncStatuses,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // Clear all user data (on logout) but keep content
  Future<void> clearUserData() async {
    await delete(userAnswers).go();
    await delete(userQuestionProgress).go();
    await delete(userFlashcardProgress).go();
    await delete(userBookmarks).go();
    await delete(userNotes).go();
    await delete(userAchievements).go();
    await delete(userDailyActivity).go();
    await delete(mockExamResults).go();
  }

  // Clear all data (full reset)
  Future<void> clearAllData() async {
    await clearUserData();
    await delete(questions).go();
    await delete(questionCategories).go();
    await delete(flashcards).go();
    await delete(flashcardDecks).go();
    await delete(achievements).go();
    await delete(syncStatuses).go();
  }
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'mrcppacesprep.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
```

**Step 7: Create tables barrel export**

Create `flutter_app/lib/core/database/tables/tables.dart`:

```dart
export 'categories.dart';
export 'questions.dart';
export 'flashcards.dart';
export 'user_progress.dart';
export 'sync_status.dart';
```

**Step 8: Generate Drift code**

Run:
```bash
cd /Users/sofianyoussef/Desktop/Other\ Projects/mrcppacesprep/flutter_app
dart run build_runner build --delete-conflicting-outputs
```
Expected: database.g.dart generated

**Step 9: Commit**

```bash
git add lib/core/database/
git commit -m "feat(flutter): add Drift database with all tables"
```

---

### Task 10: Setup Supabase Client

**Files:**
- Create: `flutter_app/lib/core/network/supabase_client.dart`

**Step 1: Create supabase_client.dart**

Create `flutter_app/lib/core/network/supabase_client.dart`:

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/api.dart';

final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

Future<void> initSupabase() async {
  await Supabase.initialize(
    url: ApiConstants.supabaseUrl,
    anonKey: ApiConstants.supabaseAnonKey,
  );
}
```

**Step 2: Create network barrel**

Create `flutter_app/lib/core/network/network.dart`:

```dart
export 'supabase_client.dart';
```

**Step 3: Commit**

```bash
git add lib/core/network/
git commit -m "feat(flutter): add Supabase client provider"
```

---

### Task 11: Setup GoRouter

**Files:**
- Create: `flutter_app/lib/core/router/app_router.dart`
- Create: `flutter_app/lib/core/router/routes.dart`

**Step 1: Create routes.dart**

Create `flutter_app/lib/core/router/routes.dart`:

```dart
abstract class Routes {
  // Auth
  static const splash = '/';
  static const onboarding = '/onboarding';
  static const login = '/login';
  static const signup = '/signup';
  static const goalSetup = '/goal-setup';
  static const paywall = '/paywall';

  // Main app
  static const home = '/home';
  static const questions = '/questions';
  static const questionPractice = '/questions/practice';
  static const calculations = '/calculations';
  static const calculationPractice = '/calculations/practice';
  static const bookmarks = '/bookmarks';
  static const study = '/study';
  static const flashcards = '/flashcards';
  static const flashcardPractice = '/flashcards/practice';
  static const mockExams = '/mock-exams';
  static const mockExamSession = '/mock-exams/session';
  static const notes = '/notes';
  static const progress = '/progress';
  static const achievements = '/achievements';
  static const settings = '/settings';
  static const syncStatus = '/settings/sync';
}
```

**Step 2: Create app_router.dart**

Create `flutter_app/lib/core/router/app_router.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'routes.dart';

// Placeholder screens - will be replaced with actual implementations
class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text(title)),
    );
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: Routes.splash,
    debugLogDiagnostics: true,
    routes: [
      // Splash
      GoRoute(
        path: Routes.splash,
        builder: (context, state) => const _PlaceholderScreen(title: 'Splash'),
      ),

      // Auth flow
      GoRoute(
        path: Routes.onboarding,
        builder: (context, state) => const _PlaceholderScreen(title: 'Onboarding'),
      ),
      GoRoute(
        path: Routes.login,
        builder: (context, state) => const _PlaceholderScreen(title: 'Login'),
      ),
      GoRoute(
        path: Routes.signup,
        builder: (context, state) => const _PlaceholderScreen(title: 'Sign Up'),
      ),
      GoRoute(
        path: Routes.goalSetup,
        builder: (context, state) => const _PlaceholderScreen(title: 'Goal Setup'),
      ),
      GoRoute(
        path: Routes.paywall,
        builder: (context, state) => const _PlaceholderScreen(title: 'Paywall'),
      ),

      // Main app with bottom navigation
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return _MainScaffold(navigationShell: navigationShell);
        },
        branches: [
          // Home tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: Routes.home,
                builder: (context, state) => const _PlaceholderScreen(title: 'Home'),
              ),
            ],
          ),

          // Questions tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: Routes.questions,
                builder: (context, state) => const _PlaceholderScreen(title: 'Questions'),
                routes: [
                  GoRoute(
                    path: 'practice',
                    builder: (context, state) => const _PlaceholderScreen(title: 'Question Practice'),
                  ),
                ],
              ),
            ],
          ),

          // Study tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: Routes.study,
                builder: (context, state) => const _PlaceholderScreen(title: 'Study'),
              ),
            ],
          ),

          // Progress tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: Routes.progress,
                builder: (context, state) => const _PlaceholderScreen(title: 'Progress'),
              ),
            ],
          ),

          // Settings tab
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: Routes.settings,
                builder: (context, state) => const _PlaceholderScreen(title: 'Settings'),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});

class _MainScaffold extends StatelessWidget {
  const _MainScaffold({required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) => navigationShell.goBranch(index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.quiz_outlined),
            activeIcon: Icon(Icons.quiz),
            label: 'Questions',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school_outlined),
            activeIcon: Icon(Icons.school),
            label: 'Study',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart_outlined),
            activeIcon: Icon(Icons.bar_chart),
            label: 'Progress',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
```

**Step 3: Create router barrel**

Create `flutter_app/lib/core/router/router.dart`:

```dart
export 'app_router.dart';
export 'routes.dart';
```

**Step 4: Commit**

```bash
git add lib/core/router/
git commit -m "feat(flutter): add GoRouter with bottom navigation shell"
```

---

### Task 12: Create Main App Entry Point

**Files:**
- Modify: `flutter_app/lib/main.dart`
- Create: `flutter_app/lib/app.dart`

**Step 1: Create app.dart**

Create `flutter_app/lib/app.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';

class MRCPPACESPREPApp extends ConsumerWidget {
  const MRCPPACESPREPApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'MRCPPACESPREP',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      routerConfig: router,
    );
  }
}
```

**Step 2: Update main.dart**

Replace contents of `flutter_app/lib/main.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';
import 'core/network/supabase_client.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
    ),
  );

  // Initialize Supabase
  await initSupabase();

  runApp(
    const ProviderScope(
      child: MRCPPACESPREPApp(),
    ),
  );
}
```

**Step 3: Create core barrel export**

Create `flutter_app/lib/core/core.dart`:

```dart
export 'constants/constants.dart';
export 'theme/theme.dart';
export 'router/router.dart';
export 'network/network.dart';
export 'database/database.dart';
```

**Step 4: Commit**

```bash
git add lib/main.dart lib/app.dart lib/core/core.dart
git commit -m "feat(flutter): add main app entry point with Riverpod and router"
```

---

## Phase 2: Authentication Feature

### Task 13: Create Auth Models

**Files:**
- Create: `flutter_app/lib/features/auth/data/models/user_model.dart`
- Create: `flutter_app/lib/features/auth/data/models/subscription_model.dart`

**Step 1: Create user_model.dart**

Create `flutter_app/lib/features/auth/data/models/user_model.dart`:

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    String? displayName,
    String? avatarUrl,
    DateTime? examDate,
    int? dailyQuestionGoal,
    int? dailyFlashcardGoal,
    bool? onboardingCompleted,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
```

**Step 2: Create subscription_model.dart**

Create `flutter_app/lib/features/auth/data/models/subscription_model.dart`:

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'subscription_model.freezed.dart';
part 'subscription_model.g.dart';

@freezed
class SubscriptionModel with _$SubscriptionModel {
  const factory SubscriptionModel({
    required String id,
    required String userId,
    required String packageType,
    required String status,
    required DateTime accessGrantedAt,
    DateTime? accessExpiresAt,
  }) = _SubscriptionModel;

  factory SubscriptionModel.fromJson(Map<String, dynamic> json) =>
      _$SubscriptionModelFromJson(json);

  const SubscriptionModel._();

  bool get isActive {
    if (status != 'active') return false;
    if (accessExpiresAt == null) return true; // Lifetime
    return DateTime.now().isBefore(accessExpiresAt!);
  }
}
```

**Step 3: Create models barrel**

Create `flutter_app/lib/features/auth/data/models/models.dart`:

```dart
export 'user_model.dart';
export 'subscription_model.dart';
```

**Step 4: Generate Freezed code**

Run:
```bash
cd /Users/sofianyoussef/Desktop/Other\ Projects/mrcppacesprep/flutter_app
dart run build_runner build --delete-conflicting-outputs
```

**Step 5: Commit**

```bash
git add lib/features/auth/
git commit -m "feat(flutter): add auth models (user, subscription)"
```

---

### Task 14: Create Auth Repository

**Files:**
- Create: `flutter_app/lib/features/auth/data/repositories/auth_repository.dart`

**Step 1: Create auth_repository.dart**

Create `flutter_app/lib/features/auth/data/repositories/auth_repository.dart`:

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../../core/constants/api.dart';
import '../../../../core/network/supabase_client.dart';
import '../models/models.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return AuthRepository(client);
});

class AuthRepository {
  AuthRepository(this._client);

  final SupabaseClient _client;

  User? get currentUser => _client.auth.currentUser;

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  Future<AuthResponse> signInWithEmail({
    required String email,
    required String password,
  }) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signUpWithEmail({
    required String email,
    required String password,
  }) async {
    return await _client.auth.signUp(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signInWithApple() async {
    return await _client.auth.signInWithApple();
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  Future<void> resetPassword(String email) async {
    await _client.auth.resetPasswordForEmail(email);
  }

  Future<SubscriptionModel?> getActiveSubscription(String userId) async {
    final response = await _client
        .from(ApiConstants.tableUserSubscriptions)
        .select()
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

    if (response == null) return null;
    return SubscriptionModel.fromJson(response);
  }

  Future<Map<String, dynamic>?> getUserSettings(String userId) async {
    return await _client
        .from(ApiConstants.tableUserSettings)
        .select()
        .eq('user_id', userId)
        .maybeSingle();
  }

  Future<void> updateUserSettings({
    required String userId,
    DateTime? examDate,
    int? dailyQuestionGoal,
    int? dailyFlashcardGoal,
  }) async {
    await _client.from(ApiConstants.tableUserSettings).upsert({
      'user_id': userId,
      if (examDate != null) 'exam_date': examDate.toIso8601String(),
      if (dailyQuestionGoal != null) 'daily_question_goal': dailyQuestionGoal,
      if (dailyFlashcardGoal != null) 'daily_flashcard_goal': dailyFlashcardGoal,
      'updated_at': DateTime.now().toIso8601String(),
    });
  }
}
```

**Step 2: Commit**

```bash
git add lib/features/auth/data/repositories/
git commit -m "feat(flutter): add auth repository with Supabase integration"
```

---

### Task 15: Create Auth Providers

**Files:**
- Create: `flutter_app/lib/features/auth/providers/auth_provider.dart`

**Step 1: Create auth_provider.dart**

Create `flutter_app/lib/features/auth/providers/auth_provider.dart`:

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../data/repositories/auth_repository.dart';
import '../data/models/models.dart';

// Current auth state
final authStateProvider = StreamProvider<AuthState>((ref) {
  final authRepo = ref.watch(authRepositoryProvider);
  return authRepo.authStateChanges;
});

// Current user
final currentUserProvider = Provider<User?>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.whenOrNull(data: (state) => state.session?.user);
});

// Subscription status
final subscriptionProvider = FutureProvider<SubscriptionModel?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  final authRepo = ref.watch(authRepositoryProvider);
  return await authRepo.getActiveSubscription(user.id);
});

// Is user subscribed
final isSubscribedProvider = Provider<bool>((ref) {
  final subscription = ref.watch(subscriptionProvider);
  return subscription.whenOrNull(data: (sub) => sub?.isActive ?? false) ?? false;
});

// User settings
final userSettingsProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  final authRepo = ref.watch(authRepositoryProvider);
  return await authRepo.getUserSettings(user.id);
});

// Auth notifier for actions
final authNotifierProvider = StateNotifierProvider<AuthNotifier, AsyncValue<void>>((ref) {
  return AuthNotifier(ref);
});

class AuthNotifier extends StateNotifier<AsyncValue<void>> {
  AuthNotifier(this._ref) : super(const AsyncValue.data(null));

  final Ref _ref;

  AuthRepository get _authRepo => _ref.read(authRepositoryProvider);

  Future<void> signInWithEmail(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await _authRepo.signInWithEmail(email: email, password: password);
    });
  }

  Future<void> signUpWithEmail(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await _authRepo.signUpWithEmail(email: email, password: password);
    });
  }

  Future<void> signInWithApple() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await _authRepo.signInWithApple();
    });
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await _authRepo.signOut();
    });
  }

  Future<void> resetPassword(String email) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await _authRepo.resetPassword(email);
    });
  }
}
```

**Step 2: Create providers barrel**

Create `flutter_app/lib/features/auth/providers/providers.dart`:

```dart
export 'auth_provider.dart';
```

**Step 3: Commit**

```bash
git add lib/features/auth/providers/
git commit -m "feat(flutter): add auth providers with Riverpod"
```

---

### Task 16: Create Login Screen

**Files:**
- Create: `flutter_app/lib/features/auth/screens/login_screen.dart`

**Step 1: Create login_screen.dart**

Create `flutter_app/lib/features/auth/screens/login_screen.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/constants.dart';
import '../../../core/router/routes.dart';
import '../../../shared/widgets/widgets.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _signInWithEmail() async {
    if (!_formKey.currentState!.validate()) return;

    await ref.read(authNotifierProvider.notifier).signInWithEmail(
          _emailController.text.trim(),
          _passwordController.text,
        );
  }

  Future<void> _signInWithApple() async {
    await ref.read(authNotifierProvider.notifier).signInWithApple();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final isLoading = authState.isLoading;

    ref.listen(authNotifierProvider, (prev, next) {
      if (next.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.error.toString()),
            backgroundColor: AppColors.error,
          ),
        );
      }
    });

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 48),

              // Logo placeholder
              Center(
                child: Text(
                  AppStrings.appName,
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                        color: AppColors.primaryPurple,
                      ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                AppStrings.tagline,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
              ),

              const SizedBox(height: 48),

              // Apple Sign In
              PillButton(
                label: AppStrings.signInWithApple,
                onPressed: _signInWithApple,
                variant: PillButtonVariant.primary,
                size: PillButtonSize.lg,
                icon: Icons.apple,
                fullWidth: true,
                isLoading: isLoading,
              ),

              const SizedBox(height: 24),

              // Divider
              Row(
                children: [
                  const Expanded(child: Divider()),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'or',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                    ),
                  ),
                  const Expanded(child: Divider()),
                ],
              ),

              const SizedBox(height: 24),

              // Email form
              GlassCard(
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Email field
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        decoration: const InputDecoration(
                          hintText: AppStrings.email,
                          prefixIcon: Icon(Icons.email_outlined),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email';
                          }
                          if (!value.contains('@')) {
                            return 'Please enter a valid email';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Password field
                      TextFormField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _signInWithEmail(),
                        decoration: InputDecoration(
                          hintText: AppStrings.password,
                          prefixIcon: const Icon(Icons.lock_outlined),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your password';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 8),

                      // Forgot password
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: () {
                            // TODO: Implement forgot password
                          },
                          child: const Text(AppStrings.forgotPassword),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Sign in button
                      PillButton(
                        label: AppStrings.signIn,
                        onPressed: _signInWithEmail,
                        variant: PillButtonVariant.primary,
                        size: PillButtonSize.lg,
                        fullWidth: true,
                        isLoading: isLoading,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Sign up link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    AppStrings.noAccount,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  TextButton(
                    onPressed: () => context.go(Routes.signup),
                    child: const Text(AppStrings.signUp),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

**Step 2: Commit**

```bash
git add lib/features/auth/screens/
git commit -m "feat(flutter): add login screen with email and Apple Sign-In"
```

---

*[Plan continues with Tasks 17-50+ covering: Sign Up Screen, Splash Screen, Onboarding Screens, Goal Setup, Paywall, Dashboard, Questions Feature, Calculations Feature, Flashcards Feature, Mock Exams Feature, Progress Feature, Achievements Feature, Bookmarks, Notes, Settings, Sync Service, etc.]*

---

## Summary

This implementation plan covers the complete Flutter app build in phases:

**Phase 1 (Tasks 1-12):** Project setup, dependencies, theme, widgets, database, routing
**Phase 2 (Tasks 13-20):** Authentication (login, signup, Apple Sign-In, splash, paywall)
**Phase 3 (Tasks 21-28):** Onboarding and goal setup
**Phase 4 (Tasks 29-36):** Dashboard and home screen
**Phase 5 (Tasks 37-44):** Questions and calculations practice
**Phase 6 (Tasks 45-52):** Flashcards with SM2 spaced repetition
**Phase 7 (Tasks 53-58):** Mock exams
**Phase 8 (Tasks 59-66):** Progress, achievements, bookmarks, notes
**Phase 9 (Tasks 67-72):** Settings and sync service
**Phase 10 (Tasks 73-76):** Polish, testing, and deployment prep

Each task is designed to be completed in 2-5 minutes with explicit file paths, complete code, and commit instructions.
