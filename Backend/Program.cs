using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Backend.Controllers;
using System.Security.Cryptography;

namespace Backend
{
    class Program
    {
        static void Main(string[] args)
        {
            
            string expectedHash;
            string actualHash;

            using (FileStream stream = File.OpenRead("key/productKey.png"))
            {
                SHA256Managed sha = new SHA256Managed();
                byte[] hash = sha.ComputeHash(stream);
                actualHash = BitConverter.ToString(hash).Replace("-", String.Empty);
            }

            using (FileStream stream = new FileStream("Properties/xd", FileMode.Open, FileAccess.Read))
            {
                byte[] bytes = new byte[stream.Length];
                stream.Read(bytes, 0, (int)stream.Length);
                expectedHash = Convert.ToBase64String(bytes);
            }

            if (expectedHash != actualHash)
            {
                throw new SecurityTokenInvalidAudienceException("Nem megfelelo a termekkulcs!");
            }

            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            builder.Services.AddScoped<AppDbContext, AppDbContext>();
            builder.Services.AddCors(options => {
                options.AddDefaultPolicy(policy => {
                    policy
                        .WithOrigins(
                            "http://localhost:5500",
                            "http://127.0.0.1:5500",
                            "http://localhost:3000"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                    ;
                });
            });
            builder.Services
                .AddAuthentication(options => {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"]!,
                        ValidAudience = builder.Configuration["Jwt:Audience"]!,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                    };
                })
            ;
            builder.Services.AddAuthorization(options => {
                KezeloController.OsszesEngedelyNev.ToList().ForEach(engedelyNev => {
                    options.AddPolicy(engedelyNev, policy => {
                        policy.RequireClaim(engedelyNev, "true");
                    });
                });
            });
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            WebApplication app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseHttpsRedirection();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }

        class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
        {
            public void Configure(SwaggerGenOptions options)
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
                    In = ParameterLocation.Header,
                    Description = "Provide a valid token, or I'll hire a pair of scissors to cut of your balls",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme {
                            Reference = new OpenApiReference {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            }
        }
    }
}
