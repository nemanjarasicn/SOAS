import {TestBed} from "@angular/core/testing";
import {TestingModule} from "./testing/testing.module";
import {AuthGuard} from "./auth.guard";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {ConstantsService} from "./_services/constants.service";

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('AuthGuard', () => {

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const fakeUrls = ['/', '/home', '/articles'];
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let constantsService: ConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ConstantsService]
    });
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    constantsService = TestBed.inject(ConstantsService);
    guard = new AuthGuard(routerSpy, constantsService);
  });

  it('grants route access', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue('token-abc123456');
    // Act
    const canActivate = guard.canActivate(dummyRoute, fakeRouterState('home'));
    // Assert
    expect(canActivate).toBeTruthy();
  });

  it('rejects access', () => {
    // Arrange
    spyOn(localStorage, 'getItem').and.returnValue(undefined);
    // Act
    const canActivate = guard.canActivate(dummyRoute, fakeRouterState('home'));
    // Assert
    expect(canActivate).toBeFalsy();
  });

});
