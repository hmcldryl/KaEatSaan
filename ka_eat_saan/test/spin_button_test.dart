import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ka_eat_saan/widgets/spin_button.dart';

void main() {
  group('SpinButton Widget Tests', () {
    testWidgets('renders with default text', (WidgetTester tester) async {
      bool wasPressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SpinButton(
              onPressed: () => wasPressed = true,
            ),
          ),
        ),
      );

      expect(find.text('Spin'), findsOneWidget);
    });

    testWidgets('renders with custom text', (WidgetTester tester) async {
      const customText = 'Custom Spin';

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SpinButton(
              onPressed: () {},
              text: customText,
            ),
          ),
        ),
      );

      expect(find.text(customText), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (WidgetTester tester) async {
      bool wasPressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SpinButton(
              onPressed: () => wasPressed = true,
            ),
          ),
        ),
      );

      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();

      expect(wasPressed, true);
    });

    testWidgets('has correct styling', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SpinButton(
              onPressed: () {},
            ),
          ),
        ),
      );

      final button = tester.widget<ElevatedButton>(find.byType(ElevatedButton));
      final buttonStyle = button.style!;

      // Test background color
      final backgroundColor = buttonStyle.backgroundColor?.resolve({});
      expect(backgroundColor, Colors.deepOrange);

      // Test foreground color
      final foregroundColor = buttonStyle.foregroundColor?.resolve({});
      expect(foregroundColor, Colors.white);

      // Test padding
      final padding = buttonStyle.padding?.resolve({}) as EdgeInsetsGeometry;
      expect(
          padding,
          const EdgeInsets.symmetric(horizontal: 30, vertical: 15)
      );

      // Test text style
      final textStyle = buttonStyle.textStyle?.resolve({});
      expect(textStyle?.fontSize, 18);
      expect(textStyle?.fontWeight, FontWeight.bold);
    });

    testWidgets('renders in different screen sizes', (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(320, 480)); // Small screen

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SpinButton(
              onPressed: () {},
            ),
          ),
        ),
      );

      expect(find.byType(SpinButton), findsOneWidget);

      await tester.binding.setSurfaceSize(const Size(1024, 768)); // Large screen
      await tester.pumpAndSettle();

      expect(find.byType(SpinButton), findsOneWidget);
    });
  });
}