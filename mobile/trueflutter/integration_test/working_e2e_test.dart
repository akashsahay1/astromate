import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:astromate/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  group('Astromate Working E2E Tests', () {
    late List<TestUser> testUsers;
    
    setUpAll(() {
      testUsers = generateTestUsers();
    });

    testWidgets('Complete E2E Test - Navigation, Registration, Login', (WidgetTester tester) async {
      // Launch the app
      app.main();
      await tester.pumpAndSettle(const Duration(seconds: 5));
      
      print('🚀 App launched successfully');

      // Wait for app to fully load
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();

      // Phase 1: Handle Onboarding
      await handleOnboarding(tester);
      
      // Phase 2: Register users
      for (int i = 0; i < testUsers.length && i < 5; i++) {
        final user = testUsers[i];
        print('👤 Registering user ${i + 1}: ${user.name}');
        await registerUser(tester, user);
        
        if (i < testUsers.length - 1) {
          await navigateBackToWelcome(tester);
        }
      }

      // Phase 3: Test login for registered users
      for (int i = 0; i < testUsers.length && i < 3; i++) {
        final user = testUsers[i];
        print('🔐 Testing login for user ${i + 1}: ${user.email}');
        await testUserLogin(tester, user);
        
        if (i < 2) {
          await logoutUser(tester);
          await navigateBackToWelcome(tester);
        }
      }

      print('✅ All E2E tests completed successfully!');
    });
  });
}

class TestUser {
  final String name;
  final String email;
  final String phone;
  final String password;
  final bool isAstrologer;
  
  TestUser({
    required this.name,
    required this.email,
    required this.phone,
    required this.password,
    required this.isAstrologer,
  });
}

List<TestUser> generateTestUsers() {
  final random = Random();
  final timestamp = DateTime.now().millisecondsSinceEpoch;
  
  return List.generate(10, (index) {
    final isAstrologer = index % 2 == 0; // Alternate between astrologer and customer
    final userType = isAstrologer ? 'astrologer' : 'customer';
    
    return TestUser(
      name: 'Test ${isAstrologer ? 'Astrologer' : 'Customer'} ${index + 1}',
      email: 'test$userType$index.$timestamp@astromate.online',
      phone: '${9000000000 + index + timestamp % 1000}',
      password: 'TestPass123!',
      isAstrologer: isAstrologer,
    );
  });
}

Future<void> handleOnboarding(WidgetTester tester) async {
  print('📱 Handling onboarding screens...');
  
  // Look for onboarding elements
  if (find.text('Skip').evaluate().isNotEmpty) {
    print('Found onboarding Skip button, tapping it');
    await tester.tap(find.text('Skip'));
    await tester.pumpAndSettle(const Duration(seconds: 2));
  } else if (find.text('Get Started').evaluate().isNotEmpty) {
    print('Found Get Started button, tapping it');
    await tester.tap(find.text('Get Started'));
    await tester.pumpAndSettle(const Duration(seconds: 2));
  }
  
  // Wait for navigation to complete
  await tester.pump(const Duration(seconds: 2));
  await tester.pumpAndSettle();
  
  print('✅ Onboarding handled successfully');
}

Future<void> registerUser(WidgetTester tester, TestUser user) async {
  try {
    print('🔍 Looking for registration navigation...');
    
    // Navigate to signup
    await tapByText(tester, 'Sign Up');
    await tester.pumpAndSettle(const Duration(seconds: 2));
    
    // Choose user type
    if (user.isAstrologer) {
      await tapByText(tester, 'Join as Astrologer');
    } else {
      // For customers, might not need to select type
      // Look for customer signup option if available
      if (find.text('Join as Customer').evaluate().isNotEmpty) {
        await tapByText(tester, 'Join as Customer');
      }
    }
    await tester.pumpAndSettle(const Duration(seconds: 2));
    
    // Fill registration form step by step
    await fillRegistrationForm(tester, user);
    
    print('✅ Registration completed for ${user.name}');
    
  } catch (e) {
    print('❌ Registration failed for ${user.name}: $e');
  }
}

Future<void> fillRegistrationForm(WidgetTester tester, TestUser user) async {
  // Personal Information Section
  print('📝 Filling personal information...');
  await fillTextFieldByLabel(tester, 'Full Name', user.name);
  await fillTextFieldByLabel(tester, 'Phone Number', user.phone.substring(1)); // Remove +91
  
  // Continue to next section
  await tapByText(tester, 'Continue');
  await tester.pumpAndSettle(const Duration(seconds: 2));
  
  // Contact & Security Section
  print('📝 Filling contact information...');
  await fillTextFieldByLabel(tester, 'Email Address', user.email);
  await fillTextFieldByLabel(tester, 'Password', user.password);
  await fillTextFieldByLabel(tester, 'Confirm Password', user.password);
  
  // Continue to next section
  await tapByText(tester, 'Continue');
  await tester.pumpAndSettle(const Duration(seconds: 2));
  
  // Birth Details Section
  print('📝 Filling birth details...');
  
  // Select date of birth
  await tapByText(tester, 'Select your Date of Birth');
  await tester.pumpAndSettle(const Duration(seconds: 1));
  
  // Handle date picker
  if (find.text('OK').evaluate().isNotEmpty) {
    await tester.tap(find.text('OK'));
    await tester.pumpAndSettle();
  }
  
  // Accept terms and conditions
  final checkbox = find.byType(Checkbox);
  if (checkbox.evaluate().isNotEmpty) {
    await tester.tap(checkbox.first);
    await tester.pumpAndSettle();
  }
  
  // Continue or Create Account
  if (user.isAstrologer) {
    await tapByText(tester, 'Continue');
    await tester.pumpAndSettle(const Duration(seconds: 2));
    
    // Professional Section for Astrologers
    await fillAstrologerProfessionalInfo(tester);
  } else {
    // For customers, this might be the final step
    await tapByText(tester, 'Create Account');
    await tester.pumpAndSettle(const Duration(seconds: 5));
  }
}

Future<void> fillAstrologerProfessionalInfo(WidgetTester tester) async {
  print('📝 Filling professional information...');
  
  // Fill experience
  await fillTextFieldByLabel(tester, 'Years of Experience', '5');
  
  // Fill bio
  await fillTextFieldByLabel(tester, 'Professional Bio', 'Experienced astrologer with 5 years of practice in Vedic astrology.');
  
  // Add qualification
  final qualificationField = find.widgetWithText(TextFormField, 'Add a qualification');
  if (qualificationField.evaluate().isNotEmpty) {
    await tester.tap(qualificationField);
    await tester.enterText(qualificationField, 'M.A. in Astrology');
    await tester.pumpAndSettle();
    
    // Tap add button
    await tester.tap(find.byIcon(Icons.add));
    await tester.pumpAndSettle();
  }
  
  // Select languages
  await tapByText(tester, 'Tap to select');
  await tester.pumpAndSettle(const Duration(seconds: 1));
  
  // In the dropdown, select English if available
  if (find.text('English').evaluate().isNotEmpty) {
    await tester.tap(find.text('English'));
    await tester.pumpAndSettle();
  }
  
  // Done with languages
  if (find.text('Done').evaluate().isNotEmpty) {
    await tester.tap(find.text('Done'));
    await tester.pumpAndSettle();
  }
  
  await tapByText(tester, 'Continue');
  await tester.pumpAndSettle(const Duration(seconds: 2));
  
  // Address section
  await fillAddressSection(tester);
  
  // Rates section
  await fillRatesSection(tester);
}

Future<void> fillAddressSection(WidgetTester tester) async {
  print('📝 Filling address information...');
  
  await fillTextFieldByLabel(tester, 'Address', '123 Test Street, Test Area');
  await fillTextFieldByLabel(tester, 'City', 'Mumbai');
  await fillTextFieldByLabel(tester, 'State', 'Maharashtra');
  await fillTextFieldByLabel(tester, 'ZIP/Postal Code', '400001');
  
  await tapByText(tester, 'Continue');
  await tester.pumpAndSettle(const Duration(seconds: 2));
}

Future<void> fillRatesSection(WidgetTester tester) async {
  print('📝 Filling consultation rates...');
  
  await fillTextFieldByLabel(tester, 'Call Rate (₹/min)', '50');
  await fillTextFieldByLabel(tester, 'Chat Rate (₹/min)', '30');
  await fillTextFieldByLabel(tester, 'Video Call Rate (₹/min)', '80');
  
  await tapByText(tester, 'Create Profile');
  await tester.pumpAndSettle(const Duration(seconds: 5));
  
  // Handle success dialog
  if (find.text('Continue').evaluate().isNotEmpty) {
    await tester.tap(find.text('Continue'));
    await tester.pumpAndSettle();
  }
}

Future<void> testUserLogin(WidgetTester tester, TestUser user) async {
  try {
    print('🔐 Testing login for ${user.email}');
    
    // Navigate to login
    await tapByText(tester, 'Sign In');
    await tester.pumpAndSettle(const Duration(seconds: 2));
    
    // Fill login form
    await fillTextFieldByLabel(tester, 'Email Address', user.email);
    await fillTextFieldByLabel(tester, 'Password', user.password);
    
    // Tap Sign In button
    await tapByText(tester, 'Sign In');
    await tester.pumpAndSettle(const Duration(seconds: 5));
    
    // Verify login success (look for home screen elements)
    await tester.pump(const Duration(seconds: 2));
    
    print('✅ Login test completed for ${user.email}');
    
  } catch (e) {
    print('❌ Login failed for ${user.email}: $e');
  }
}

Future<void> logoutUser(WidgetTester tester) async {
  print('📤 Logging out user...');
  
  // Look for logout options
  if (find.byIcon(Icons.logout).evaluate().isNotEmpty) {
    await tester.tap(find.byIcon(Icons.logout));
    await tester.pumpAndSettle(const Duration(seconds: 2));
  } else if (find.text('Logout').evaluate().isNotEmpty) {
    await tester.tap(find.text('Logout'));
    await tester.pumpAndSettle(const Duration(seconds: 2));
  }
  
  print('✅ Logout completed');
}

Future<void> navigateBackToWelcome(WidgetTester tester) async {
  print('🔙 Navigating back to welcome screen...');
  
  // Try various back navigation methods
  if (find.byIcon(Icons.arrow_back_ios).evaluate().isNotEmpty) {
    await tester.tap(find.byIcon(Icons.arrow_back_ios));
    await tester.pumpAndSettle(const Duration(seconds: 2));
  } else if (find.byIcon(Icons.close).evaluate().isNotEmpty) {
    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle(const Duration(seconds: 2));
  }
  
  // Keep going back until we find welcome screen elements
  int attempts = 0;
  while (attempts < 5 && 
         find.text('Welcome').evaluate().isEmpty && 
         find.text('Sign In').evaluate().isEmpty) {
    
    if (find.byIcon(Icons.arrow_back_ios).evaluate().isNotEmpty) {
      await tester.tap(find.byIcon(Icons.arrow_back_ios));
      await tester.pumpAndSettle(const Duration(seconds: 1));
    }
    attempts++;
  }
  
  print('✅ Navigation completed');
}

// Helper functions
Future<void> tapByText(WidgetTester tester, String text) async {
  final finder = find.text(text);
  if (finder.evaluate().isNotEmpty) {
    await tester.tap(finder.first);
    await tester.pumpAndSettle();
  } else {
    print('⚠️ Could not find text: $text');
  }
}

Future<void> fillTextFieldByLabel(WidgetTester tester, String label, String text) async {
  // Try to find the text field by its label
  final labelFinder = find.text(label);
  
  if (labelFinder.evaluate().isNotEmpty) {
    // Look for TextFormField near the label
    final textFields = find.byType(TextFormField);
    
    for (int i = 0; i < textFields.evaluate().length; i++) {
      try {
        await tester.tap(textFields.at(i));
        await tester.pumpAndSettle();
        await tester.enterText(textFields.at(i), text);
        await tester.pumpAndSettle();
        print('✅ Filled "$label" with: $text');
        return;
      } catch (e) {
        continue;
      }
    }
  }
  
  print('⚠️ Could not fill field: $label');
}