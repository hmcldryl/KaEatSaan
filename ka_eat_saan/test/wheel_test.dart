import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ka_eat_saan/widgets/wheel.dart';

void main() {
  group('Wheel Widget Tests', () {
    final testItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

    testWidgets('renders with default dimensions', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: testItems,
            ),
          ),
        ),
      );

      final wheelFinder = find.byType(Container);
      final container = tester.widget<Container>(wheelFinder.first);

      expect(container.constraints?.maxWidth, 300);
      expect(container.constraints?.maxHeight, 300);
    });

    testWidgets('renders with custom dimensions', (WidgetTester tester) async {
      const customWidth = 400.0;
      const customHeight = 400.0;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: testItems,
              width: customWidth,
              height: customHeight,
            ),
          ),
        ),
      );

      final wheelFinder = find.byType(Container);
      final container = tester.widget<Container>(wheelFinder.first);

      expect(container.constraints?.maxWidth, customWidth);
      expect(container.constraints?.maxHeight, customHeight);
    });

    testWidgets('renders all items', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: testItems,
            ),
          ),
        ),
      );

      for (final item in testItems) {
        expect(find.text(item), findsOneWidget);
      }
    });

    testWidgets('handles empty items list', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: const [],
            ),
          ),
        ),
      );

      expect(find.byType(Wheel), findsOneWidget);
    });

    testWidgets('spin method triggers animation', (WidgetTester tester) async {
      String? selectedItem;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: testItems,
              onSpinComplete: (item) {
                selectedItem = item;
              },
            ),
          ),
        ),
      );

      // Get the wheel state
      final WheelState state = tester.state(find.byType(Wheel));

      // Trigger spin
      state.spin();
      await tester.pump();

      // Verify animation is running
      expect(state.isAnimating, true);

      // Fast forward animation
      await tester.pumpAndSettle();

      // Verify callback was called with a selected item
      expect(selectedItem, isNotNull);
      expect(testItems.contains(selectedItem!), true);
    });

    testWidgets('wheel has proper styling', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: testItems,
            ),
          ),
        ),
      );

      final containerFinder = find.byType(Container);
      final container = tester.widget<Container>(containerFinder.first);
      final decoration = container.decoration as BoxDecoration;

      // Verify wheel styling
      expect(decoration.shape, BoxShape.circle);
      expect(decoration.color, Colors.white);

      // Verify shadow
      expect(decoration.boxShadow?.length, 1);
      final shadow = decoration.boxShadow!.first;
      expect(shadow.color, Colors.grey.withOpacity(0.5));
      expect(shadow.spreadRadius, 5);
      expect(shadow.blurRadius, 7);
      expect(shadow.offset, const Offset(0, 3));
    });

    testWidgets('items have correct text style', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: testItems,
            ),
          ),
        ),
      );

      final textFinder = find.byType(Text);
      final text = tester.widget<Text>(textFinder.first);

      expect(text.style?.fontSize, 16);
      expect(text.style?.fontWeight, FontWeight.bold);
    });

    testWidgets('onSpinComplete callback is called with correct item', (WidgetTester tester) async {
      String? completedItem;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Wheel(
              items: testItems,
              onSpinComplete: (item) {
                completedItem = item;
              },
            ),
          ),
        ),
      );

      final state = tester.state<WheelState>(find.byType(Wheel));
      state.spin();

      // Let the animation complete
      await tester.pumpAndSettle();

      // Verify callback was called
      expect(completedItem, isNotNull);
      expect(testItems.contains(completedItem), true);
      expect(completedItem, equals(state.selectedItem));
    });
  });
}