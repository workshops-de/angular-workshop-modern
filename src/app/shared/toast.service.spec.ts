import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarSpy: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackBarSpy = {
      open: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should show toast message with default duration', () => {
    service.show('Test message');

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Test message',
      'Close',
      { duration: 3000 }
    );
  });

  it('should show toast message with custom duration', () => {
    service.show('Custom message', 5000);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Custom message',
      'Close',
      { duration: 5000 }
    );
  });
});
