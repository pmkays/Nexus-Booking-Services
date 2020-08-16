package SEPT.Team.Seven.security;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.GenericFilterBean;

public class JwtFilter extends GenericFilterBean {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JwtFilter.class);

	private SecurityUserDetailsService userDetailsService;
	private String bearer = "Bearer";

	public JwtFilter(SecurityUserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}

	/**
	 * Determine if there is a JWT as part of the HTTP Request Header. If it is
	 * valid then set the current context With the Authentication(user and roles)
	 * found in the token
	 */
	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain)
			throws IOException, ServletException {
		LOGGER.info("Checking for JSON Web Token ");
		// Check for Authorization:Bearer JWT
		String headerValue = ((HttpServletRequest) req).getHeader("Authorization");
		LOGGER.info("Bearer present: " + getBearerToken(headerValue));
		getBearerToken(headerValue).ifPresent(token -> {
			// Pull the Username and Roles from the JWT to construct the user details
			userDetailsService.loadUserByJwtToken(token).ifPresent(userDetails -> {
				// Add the user details (Permissions) to the Context for just this API
				// invocation
				SecurityContextHolder.getContext().setAuthentication(
						new PreAuthenticatedAuthenticationToken(userDetails, "", userDetails.getAuthorities()));
			});
		});

		// move on to the next filter in the chains
		filterChain.doFilter(req, res);
	}

	//Extract the jwt token from the "Bearer <jwt>" header value if it exists.
	public Optional<String> getBearerToken(String headerVal) {
		if (headerVal != null && headerVal.startsWith(bearer)) {
			return Optional.of(headerVal.replace(bearer, "").trim());
		}
		return Optional.empty();
	}
}