import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ConsentModalComponent } from './consent-modal.component';
import { ConsentService, ConsentDto } from '../../../services/consent.service';
import { KeycloakService } from 'keycloak-angular';

describe('ConsentModalComponent', () => {
  let component: ConsentModalComponent;
  let fixture: ComponentFixture<ConsentModalComponent>;

  let mockConsentService: {
    getCurrentConsent: jest.Mock;
    updateConsent: jest.Mock;
  };

  let mockKeycloakService: {
    isLoggedIn: jest.Mock;
  };

  beforeEach(async () => {
    mockConsentService = {
      getCurrentConsent: jest.fn(),
      updateConsent: jest.fn(),
    };

    mockKeycloakService = {
      isLoggedIn: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [ConsentModalComponent],
      providers: [
        { provide: ConsentService, useValue: mockConsentService },
        { provide: KeycloakService, useValue: mockKeycloakService },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    mockConsentService.getCurrentConsent.mockReturnValue(of(null));
    fixture = TestBed.createComponent(ConsentModalComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('ngOnInit Initialization', () => {
    it('should do nothing if user is not logged in', async () => {
      mockKeycloakService.isLoggedIn.mockReturnValue(false);
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;

      await component.ngOnInit();

      expect(mockConsentService.getCurrentConsent).not.toHaveBeenCalled();
      expect(component.showModal).toBe(false);
    });

    it('should show modal with prompt state when user has no stored consent', async () => {
      mockConsentService.getCurrentConsent.mockReturnValue(of(null));
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;

      await component.ngOnInit();

      expect(component.showModal).toBe(true);
      expect(component.modalState).toBe('prompt');
    });

    it('should show modal with prompt state if consent version is outdated', async () => {
      const oldConsent: ConsentDto = {
        version: 'v0.9',
        scope: 'research',
        status: 'GRANTED',
      };
      mockConsentService.getCurrentConsent.mockReturnValue(of(oldConsent));
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;

      await component.ngOnInit();

      expect(component.showModal).toBe(true);
      expect(component.modalState).toBe('prompt');
    });

    it('should show blocking warning screen when existing consent is REVOKED', async () => {
      const revokedConsent: ConsentDto = {
        version: 'v1.0',
        scope: 'research',
        status: 'REVOKED',
      };
      mockConsentService.getCurrentConsent.mockReturnValue(of(revokedConsent));
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;

      await component.ngOnInit();

      expect(component.showModal).toBe(true);
      expect(component.modalState).toBe('rejected_warning');
    });

    it('should NOT show modal when valid GRANTED consent exists for current version', async () => {
      const activeConsent: ConsentDto = {
        version: 'v1.0',
        scope: 'research',
        status: 'GRANTED',
      };
      mockConsentService.getCurrentConsent.mockReturnValue(of(activeConsent));
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;

      await component.ngOnInit();

      expect(component.showModal).toBe(false);
    });

    it('should fallback to prompt state if checking current consent fails', async () => {
      mockConsentService.getCurrentConsent.mockReturnValue(throwError(() => new Error('Network error')));
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;

      await component.ngOnInit();

      expect(component.showModal).toBe(true);
      expect(component.modalState).toBe('prompt');
    });
  });

  describe('submitConsent', () => {
    beforeEach(() => {
      mockConsentService.getCurrentConsent.mockReturnValue(of(null));
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should close modal when user successfully grants consent', () => {
      const savedDto: ConsentDto = {
        version: 'v1.0',
        scope: 'research',
        status: 'GRANTED',
      };
      mockConsentService.updateConsent.mockReturnValue(of(savedDto));

      component.submitConsent('GRANTED');

      expect(mockConsentService.updateConsent).toHaveBeenCalledWith({
        version: 'v1.0',
        scope: 'research',
        status: 'GRANTED',
      });
      expect(component.isSubmitting).toBe(false);
      expect(component.showModal).toBe(false);
    });

    it('should switch to rejected_warning state when user revokes consent', () => {
      const revokedDto: ConsentDto = {
        version: 'v1.0',
        scope: 'research',
        status: 'REVOKED',
      };
      mockConsentService.updateConsent.mockReturnValue(of(revokedDto));

      component.submitConsent('REVOKED');

      expect(mockConsentService.updateConsent).toHaveBeenCalledWith({
        version: 'v1.0',
        scope: 'research',
        status: 'REVOKED',
      });
      expect(component.isSubmitting).toBe(false);
      expect(component.showModal).toBe(true);
      expect(component.modalState).toBe('rejected_warning');
    });

    it('should enforce fail-open policy and unblock player if granting consent encounters persistent network error', fakeAsync(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockConsentService.updateConsent.mockReturnValue(throwError(() => new Error('Server unreachable')));

      component.submitConsent('GRANTED');
      tick(3000);

      expect(component.isSubmitting).toBe(false);
      expect(component.showModal).toBe(false);
    }));

    it('should enforce fail-closed policy and remain blocked if revoking consent fails', fakeAsync(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockConsentService.updateConsent.mockReturnValue(throwError(() => new Error('Server unreachable')));

      component.submitConsent('REVOKED');
      tick(3000);

      expect(component.isSubmitting).toBe(false);
      expect(component.showModal).toBe(true);
      expect(component.modalState).toBe('rejected_warning');
    }));
  });

  describe('goToMainMenu', () => {
    it('should close the modal and redirect to computed portal URL', () => {
      fixture = TestBed.createComponent(ConsentModalComponent);
      component = fixture.componentInstance;
      component.showModal = true;

      const redirectSpy = jest
        .spyOn(component, 'redirectTo')
        .mockImplementation(() => {});

      component.goToMainMenu();

      expect(component.showModal).toBe(false);
      const { protocol, hostname, port } = window.location;
      const expectedUrl = port
        ? `${protocol}//${hostname}:4200`
        : `${protocol}//${hostname}`;
      expect(redirectSpy).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
